import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from '@/src/services/supabaseClient';

// Reuses the exact same Supabase OAuth flow as app sign-in, just with calendar scope added.
// provider_token from Google expires in ~1h so we store it with an expiry.
const TOKEN_KEY = 'google_calendar_token_v2';

export const connectGoogleCalendar = async () => {
  try {
    // Clear any previous token so we always get a fresh one with calendar scope
    await AsyncStorage.removeItem(TOKEN_KEY);
    const redirectTo = makeRedirectUri({ scheme: 'daily', path: 'auth/callback' });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
          scope: 'openid email profile https://www.googleapis.com/auth/calendar.readonly',
        },
      },
    });

    if (error) return { success: false, error: error.message };
    if (!data?.url) return { success: false, error: 'No auth URL received' };

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

    if (result.type !== 'success' || !result.url) {
      return { success: false, error: result.type === 'cancel' ? 'Cancelled' : 'Auth failed' };
    }

    const url = new URL(result.url);
    const code = url.searchParams.get('code');
    if (!code) return { success: false, error: 'No auth code in redirect' };

    const { data: sessionData, error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code).catch(() => ({ data: null, error: new Error('Exchange failed') }));

    if (exchangeError) return { success: false, error: exchangeError.message };

    const token = sessionData?.session?.provider_token;
    if (!token) return { success: false, error: 'Calendar access not granted — make sure to allow Calendar permission on the Google screen.' };

    await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify({
      accessToken: token,
      expiresAt: Date.now() + 3600_000,
    }));

    const events = await fetchGoogleCalendarEvents(token);
    return { success: true, events };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const getValidCalendarToken = async () => {
  try {
    const raw = await AsyncStorage.getItem(TOKEN_KEY);
    if (!raw) return null;

    const { accessToken, expiresAt } = JSON.parse(raw);
    if (Date.now() < expiresAt - 60_000) return accessToken;

    // Token expired — user needs to reconnect via connectGoogleCalendar()
    return null;
  } catch {
    return null;
  }
};

export const isCalendarConnected = async () => (await getValidCalendarToken()) !== null;

export const fetchGoogleCalendarEvents = async (accessToken) => {
  const now = new Date().toISOString();
  const twoWeeksOut = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

  const url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
  url.searchParams.set('timeMin', now);
  url.searchParams.set('timeMax', twoWeeksOut);
  url.searchParams.set('maxResults', '50');
  url.searchParams.set('singleEvents', 'true');
  url.searchParams.set('orderBy', 'startTime');

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Calendar API ${response.status}: ${text}`);
  }

  const data = await response.json();

  return (data.items ?? []).map(event => ({
    id: event.id,
    title: event.summary ?? '(No title)',
    start: event.start?.dateTime ?? event.start?.date,
    end: event.end?.dateTime ?? event.end?.date,
    organizer: event.organizer?.email ?? null,
    description: event.description ?? null,
    isAllDay: !event.start?.dateTime,
  }));
};

export const disconnectGoogleCalendar = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};
