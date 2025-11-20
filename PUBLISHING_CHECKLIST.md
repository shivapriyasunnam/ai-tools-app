# 🚀 Quick Start: Publish d.ai.ly to Google Play Store

## Immediate Next Steps

### 1. Install EAS CLI (5 minutes)
```bash
npm install -g eas-cli
```

### 2. Login to Expo (2 minutes)
```bash
eas login
```
*If you don't have an account, create one at https://expo.dev/signup*

### 3. Build Your App (20-30 minutes build time)
```bash
# For production (AAB for Play Store)
eas build --platform android --profile production

# OR for testing first (APK you can install directly)
eas build --platform android --profile preview
```

### 4. While the build runs, prepare these:

#### ✅ Assets Needed:
- [ ] **Feature Graphic** (1024 x 500 px) - Create a promotional banner
- [ ] **Screenshots** (at least 2) - Take screenshots of your app
- [ ] **Privacy Policy URL** - Create using https://app-privacy-policy-generator.firebaseapp.com/
- [ ] **App Description** - I've provided a template in the main guide

#### ✅ Accounts Needed:
- [ ] **Google Play Console Account** ($25 one-time fee)
  - Sign up: https://play.google.com/console/signup
- [ ] **Expo Account** (Free)
  - Sign up: https://expo.dev/signup

### 5. Download Your Build
Once the build completes (check your terminal or email), download the `.aab` file.

### 6. Upload to Google Play Console
1. Create new app in Play Console
2. Complete store listing with assets
3. Upload your `.aab` file
4. Submit for review

---

## ⏱️ Timeline Estimate

| Task | Time |
|------|------|
| Setup EAS & Build | 30-45 min |
| Create Play Console Account | 15-30 min |
| Prepare Assets (screenshots, graphics) | 1-2 hours |
| Complete Store Listing | 30-60 min |
| Google Review Process | 1-7 days |
| **Total Time (Your Work)** | **2-4 hours** |
| **Total Time (Including Review)** | **2-8 days** |

---

## 📱 What Was Updated

I've created/updated these files for you:

1. ✅ **ANDROID_PUBLISHING_GUIDE.md** - Complete step-by-step guide
2. ✅ **eas.json** - Build configuration for EAS
3. ✅ **app.json** - Added `versionCode: 1` for Android releases
4. ✅ **PUBLISHING_CHECKLIST.md** - This file

---

## 🎯 Current App Configuration

```json
App Name: d.ai.ly
Package ID: com.daily.ai
Version: 1.0.0
Version Code: 1
```

**Note:** The package ID `com.daily.ai` cannot be changed after first upload, so verify it's what you want!

---

## 📋 Pre-Flight Checklist

Before building, verify:
- [ ] App runs without crashes on your device/emulator
- [ ] All features work as expected
- [ ] No debugging code or console.logs in production
- [ ] App icon looks good (check `./assets/images/icon.png`)
- [ ] Package name is correct in `app.json` (`com.daily.ai`)

---

## 🆘 Quick Help

### Build Failed?
```bash
# Clear cache and try again
npm install
eas build --platform android --profile production --clear-cache
```

### Need to Test Before Publishing?
```bash
# Build an APK you can install directly
eas build --platform android --profile preview
```

### Check Build Status
```bash
eas build:list
```

### View Build Logs
Go to https://expo.dev and check your builds dashboard

---

## 📚 Full Documentation

For detailed explanations and troubleshooting, see:
- **ANDROID_PUBLISHING_GUIDE.md** - Complete publishing guide
- **Expo Docs:** https://docs.expo.dev/build/introduction/
- **Play Console Help:** https://support.google.com/googleplay/android-developer

---

## 🎉 Ready to Start?

Run this command now:
```bash
npm install -g eas-cli && eas login
```

Then follow the **ANDROID_PUBLISHING_GUIDE.md** for complete instructions!

Good luck! 🚀
