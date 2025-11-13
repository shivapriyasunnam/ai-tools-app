import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
const MICROSOFT_CLIENT_ID = 'YOUR_MICROSOFT_CLIENT_ID';

export const connectGoogleCalendar = async () => {
  try {
    const redirectUrl = AuthSession.getRedirectUrl();
    console.log('Redirect URL:', redirectUrl);
    
    const request = new AuthSession.AuthRequest({
      clientId: GOOGLE_CLIENT_ID,
      scopes: [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events',
      ],
      redirectUrl,
      usePKCE: true,
      discoveryUrl: 'https://accounts.google.com/.well-known/openid-configuration',
    });

    const result = await request.promptAsync(
      {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      },
      { useProxy: true }
    );

    if (result.type === 'success') {
      const { access_token } = result.params;
      
      if (access_token) {
        // Save token
        await AsyncStorage.setItem('google_calendar_token', access_token);
        
        // Fetch user's meetings
        const meetings = await fetchGoogleMeetings(access_token);
        return { success: true, meetings };
      }
    } else {
      return { success: false, error: 'Authorization cancelled' };
    }
    
    return { success: false };
  } catch (error) {
    console.error('Google Calendar connection error:', error);
    return { success: false, error: error.message };
  }
};

export const connectOutlookCalendar = async () => {
  try {
    const redirectUrl = AuthSession.getRedirectUrl();
    console.log('Redirect URL:', redirectUrl);
    
    const request = new AuthSession.AuthRequest({
      clientId: MICROSOFT_CLIENT_ID,
      scopes: [
        'Calendars.Read',
        'Calendars.Read.Shared',
        'offline_access',
      ],
      redirectUrl,
      usePKCE: true,
      discoveryUrl: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
    });

    const result = await request.promptAsync(
      {
        authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
      },
      { useProxy: true }
    );

    if (result.type === 'success') {
      const { access_token } = result.params;
      
      if (access_token) {
        // Save token
        await AsyncStorage.setItem('outlook_calendar_token', access_token);
        
        // Fetch user's meetings
        const meetings = await fetchOutlookMeetings(access_token);
        return { success: true, meetings };
      }
    } else {
      return { success: false, error: 'Authorization cancelled' };
    }
    
    return { success: false };
  } catch (error) {
    console.error('Outlook Calendar connection error:', error);
    return { success: false, error: error.message };
  }
};

// Fetch Google Calendar meetings
const fetchGoogleMeetings = async (accessToken) => {
  try {
    const now = new Date().toISOString();
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&maxResults=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) throw new Error('Failed to fetch Google meetings');
    const data = await response.json();
    
    return data.items?.map(event => ({
      id: event.id,
      title: event.summary,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      organizer: event.organizer?.email,
    })) || [];
  } catch (error) {
    console.error('Google meetings fetch error:', error);
    return [];
  }
};

// Fetch Outlook Calendar meetings
const fetchOutlookMeetings = async (accessToken) => {
  try {
    const response = await fetch(
      'https://graph.microsoft.com/v1.0/me/events?$top=10&$orderby=start/dateTime',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) throw new Error('Failed to fetch Outlook meetings');
    const data = await response.json();
    
    return data.value?.map(event => ({
      id: event.id,
      title: event.subject,
      start: event.start.dateTime,
      end: event.end.dateTime,
      organizer: event.organizer?.emailAddress?.address,
    })) || [];
  } catch (error) {
    console.error('Outlook meetings fetch error:', error);
    return [];
  }
};

// Get stored token
export const getStoredToken = async (provider) => {
  try {
    const key = provider === 'google' ? 'google_calendar_token' : 'outlook_calendar_token';
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error('Get stored token error:', error);
    return null;
  }
};

// Disconnect calendar
export const disconnectCalendar = async (provider) => {
  try {
    const key = provider === 'google' ? 'google_calendar_token' : 'outlook_calendar_token';
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Disconnect error:', error);
    return false;
  }
};
