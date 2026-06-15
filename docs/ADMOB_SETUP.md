# AdMob Setup & Go-Live Checklist

## What's Already Done

- `react-native-google-mobile-ads` v16.3.3 installed
- AdMob App ID added to `android/app/src/main/AndroidManifest.xml`
- AdMob plugin configured in `app.json`
- SDK initialized in `app/_layout.js`
- Banner ad added to Hub screen (`app/(tabs)/hub.js`)
- Test ads confirmed working on emulator

**AdMob App ID:** `ca-app-pub-7933176628735047~1170477984`
**Banner Ad Unit ID:** `ca-app-pub-7933176628735047/5587939995`

---

## Steps to Go Live with Real Ads

### Step 1 — Move app out of Closed Testing on Google Play

1. Go to [Google Play Console](https://play.google.com/console)
2. Select **d.ai.ly**
3. In the left sidebar go to **Release → Testing → Closed testing**
4. Click **Promote release** → promote to **Open testing** or directly to **Production**
5. If going to Production: fill in the store listing (screenshots, description, content rating) if not already done
6. Submit for review — Google review takes 1–3 days for new apps

### Step 2 — Link your app to AdMob

Once the app is publicly visible on Play Store:

1. Go to [AdMob Console](https://admob.google.com)
2. Click **Apps** → select **d.ai.ly (Android)**
3. Click **App settings** in the left sidebar
4. Under **App store details**, click **Add**
5. Search for `d.ai.ly` or enter the Play Store URL
6. Link the app — AdMob will start its review automatically

### Step 3 — Wait for AdMob review

- AdMob review takes **1–2 days** after the app is publicly listed
- You will get an email when the review is complete
- Status changes from "Requires review" to "Approved" in the AdMob console
- Until approved, real ads will not serve (test ads still work)

### Step 4 — Set up payment in AdMob

1. Go to [AdMob Console](https://admob.google.com)
2. Click **Payments** in the left sidebar
3. Add your payment profile (name, address, tax info)
4. Add a payment method (bank account)
5. AdMob pays out monthly when your balance exceeds $100 (CA threshold)

### Step 5 — Build and publish the production APK/AAB

After confirming test ads work, build a production release:

```bash
# From the project root
eas build --profile production --platform android
```

Or if building locally:
```bash
cd android
./gradlew bundleRelease
```

Upload the `.aab` file to Google Play Console under the appropriate track.

---

## How to Verify Real Ads Are Serving

Once AdMob review is approved:

1. Install a **production** build (not a dev build — dev builds always show test ads)
2. Open the Hub screen
3. The banner should show a real ad (no "Test Ad" label)
4. Check the AdMob dashboard — **Reports** → **Ad units** — impressions should start appearing within a few hours

---

## How the Code Works

In `app/(tabs)/hub.js`:

```js
const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds.ADAPTIVE_BANNER          // shows test ads in dev builds
  : 'ca-app-pub-7933176628735047/5587939995';  // real ads in production builds
```

`__DEV__` is automatically `true` in debug/development builds and `false` in release builds. No code change needed when going to production.

---

## Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| App crashes on startup | Missing `APPLICATION_ID` in manifest | Already fixed — entry is in `AndroidManifest.xml` |
| "No fill" / blank banner | AdMob not approved yet, or low ad inventory | Wait for approval; test ads always fill |
| Test ads show in production | Using dev build, not release build | Build with `eas build --profile production` |
| Real ads don't show | App not linked to Play Store in AdMob | Complete Step 2 above |
| Payment not received | Balance under $100 threshold | Accumulate to threshold; paid monthly |
