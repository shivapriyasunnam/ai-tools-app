# Android Publishing Guide for d.ai.ly

## 📱 Complete Step-by-Step Guide to Publish Your App on Google Play Store

---

## Prerequisites Checklist

Before you begin, ensure you have:
- ✅ A Google Play Console Developer Account ($25 one-time fee)
- ✅ Your app tested and working properly
- ✅ All required assets (icons, screenshots, promotional graphics)
- ✅ Privacy policy URL (required by Google Play)
- ✅ EAS CLI installed globally

---

## Phase 1: Setup & Configuration

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

### Step 2: Login to Expo Account
```bash
eas login
```

If you don't have an Expo account, create one at https://expo.dev/signup

### Step 3: Configure EAS Build
```bash
eas build:configure
```

This will create an `eas.json` file in your project root.

---

## Phase 2: Update App Configuration

### Step 4: Update app.json with Production Details

Your current configuration looks good, but ensure these fields are set:

```json
{
  "expo": {
    "name": "d.ai.ly",
    "slug": "daily-ai-app",
    "version": "1.0.0",
    "android": {
      "package": "com.daily.ai",
      "versionCode": 1,
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
        "android.permission.READ_CALENDAR",
        "android.permission.WRITE_CALENDAR"
      ]
    }
  }
}
```

**Important Notes:**
- `versionCode` must be an integer and increment with each release
- `version` is the user-facing version (e.g., "1.0.0", "1.0.1")
- `package` (bundle identifier) must be unique on Google Play Store

---

## Phase 3: Create Google Play Console Account

### Step 5: Register as a Google Play Developer

1. Go to https://play.google.com/console/signup
2. Sign in with your Google account
3. Pay the $25 one-time registration fee
4. Accept the Developer Distribution Agreement
5. Complete your account details

---

## Phase 4: Generate Android App Bundle (AAB)

### Step 6: Build Your Production APK/AAB

**Option A: Using EAS Build (Recommended - Easiest)**
```bash
eas build --platform android --profile production
```

**Option B: Build APK for testing**
```bash
eas build --platform android --profile preview
```

This process will:
- Upload your code to Expo's servers
- Build your app in the cloud
- Generate a signed AAB or APK
- Provide you with a download link

**Build typically takes 10-20 minutes**

### Step 7: Download Your Build

Once complete, you'll get a link to download your `.aab` (Android App Bundle) file.
Keep this file safe - you'll upload it to Google Play Console.

---

## Phase 5: Prepare Play Store Assets

### Step 8: Create Required Graphics

You need the following assets for Google Play Store:

#### **App Icon** ✅ (Already have)
- 512 x 512 px PNG
- No transparency
- Located at: `./assets/images/icon.png`

#### **Feature Graphic** (Required)
- 1024 x 500 px JPG or PNG
- Showcases your app's brand/functionality

#### **Screenshots** (Required - at least 2)
- Minimum 2 screenshots
- Recommended: 4-8 screenshots
- Phone: 16:9 or 9:16 ratio
- Minimum dimension: 320px
- Maximum dimension: 3840px
- Format: PNG or JPG (24-bit)

#### **Optional Assets:**
- **Promo Video:** YouTube link
- **TV Banner:** 1280 x 720 px
- **Wear OS Screenshot:** 384 x 384 px

---

## Phase 6: Create Play Store Listing

### Step 9: Create a New App in Play Console

1. Go to https://play.google.com/console
2. Click **"Create app"**
3. Fill in:
   - **App name:** d.ai.ly
   - **Default language:** English (US)
   - **App or game:** App
   - **Free or paid:** Free
   - Accept declarations and click **"Create app"**

### Step 10: Complete Store Listing

Navigate to **"Store presence" → "Main store listing"** and fill in:

#### **App Details:**
- **App name:** d.ai.ly
- **Short description (80 chars max):**
  ```
  AI-powered productivity companion for tasks, finances & time management
  ```

- **Full description (4000 chars max):**
  ```
  d.ai.ly - Your Daily AI-Powered Productivity Companion

  Transform your daily routine with d.ai.ly, the all-in-one productivity app that combines AI intelligence with essential tools to help you stay organized, manage your finances, and optimize your time.

  🎯 KEY FEATURES:

  📋 Smart Task Management
  • Create and organize to-do lists with intuitive interface
  • Set reminders for important tasks
  • Track your productivity over time
  • Never miss a deadline again

  💰 Financial Management
  • Income tracker with multiple source support
  • Expense tracking with categories
  • Budget planner with real-time insights
  • CSV upload for bulk expense imports
  • Visual charts and analytics

  ⏰ Time Optimization
  • Pomodoro timer with customizable intervals
  • Detailed productivity statistics
  • Focus mode to minimize distractions
  • Track work sessions and breaks

  📅 Meeting Scheduler
  • Schedule and manage meetings effortlessly
  • Calendar integration
  • Meeting reminders and notifications
  • Organize your day efficiently

  📝 Quick Notes
  • Capture ideas instantly
  • Organize notes by category
  • Search and filter notes easily
  • Sync across your workflow

  ✨ WHY CHOOSE d.ai.ly?

  • All-in-one solution - No need for multiple apps
  • Clean, intuitive interface - Easy to navigate
  • AI-powered insights - Smart suggestions for better productivity
  • Privacy-focused - Your data stays on your device
  • Regular updates - Continuously improving features

  🚀 PERFECT FOR:

  • Students managing coursework and budgets
  • Professionals juggling multiple projects
  • Freelancers tracking time and expenses
  • Anyone looking to boost productivity

  📱 FEATURES AT A GLANCE:

  • To-Do Lists & Task Management
  • Income & Expense Tracking
  • Budget Planning & Analytics
  • Pomodoro Timer & Focus Sessions
  • Meeting Scheduler
  • Quick Notes & Reminders
  • CSV Import/Export
  • Beautiful, Modern UI
  • Dark Mode Support

  Download d.ai.ly today and take control of your daily productivity!

  ---
  Have questions or feedback? Contact us at support@daily.ai
  ```

- **App icon:** Upload `assets/images/icon.png`
- **Feature graphic:** Upload your 1024x500 image
- **Phone screenshots:** Upload 2-8 screenshots
- **App category:** Productivity
- **Tags:** productivity, tasks, budget, timer, finance

#### **Contact Details:**
- **Email:** your-support-email@example.com
- **Website:** (optional)
- **Phone:** (optional)
- **Privacy Policy URL:** (Required - see Step 11)

### Step 11: Create Privacy Policy

You **MUST** have a privacy policy. Options:

**Option A:** Use a generator
- https://www.privacypolicygenerator.info/
- https://app-privacy-policy-generator.firebaseapp.com/

**Option B:** Host on GitHub Pages or your website

**Sample Privacy Policy Template:** (Customize for your app)
```
Privacy Policy for d.ai.ly

Last updated: [Date]

We respect your privacy. d.ai.ly stores all data locally on your device.
We do not collect, store, or share any personal information.

Data Storage:
- All tasks, expenses, notes, and settings are stored locally on your device
- No data is sent to external servers
- No analytics or tracking tools are used

Permissions:
- Camera: For potential AI features (optional)
- Calendar: For meeting scheduling integration (optional)
- Storage: For importing/exporting CSV files

Contact: support@daily.ai
```

---

## Phase 7: App Content & Compliance

### Step 12: Complete Content Rating Questionnaire

1. Go to **"Policy" → "App content"**
2. Click **"Start questionnaire"**
3. Answer questions about your app content:
   - Violence: None
   - Sexuality: None
   - Language: None
   - Controlled substances: None
   - Gambling: None
   - User interaction: None (unless you add chat/social features)
4. Submit and get your content rating

### Step 13: Target Audience & Content

1. Go to **"Policy" → "Target audience and content"**
2. Select **target age groups** (e.g., 13+, Everyone)
3. Indicate if app is designed for children (probably No)
4. Complete the questionnaire

### Step 14: Data Safety Section

1. Go to **"Policy" → "Data safety"**
2. Answer questions about data collection:
   - **Do you collect or share user data?** → Select based on your app
   - Since your app stores data locally: "No, we don't collect any data"
3. Submit the form

### Step 15: Complete All Policy Requirements

Check and complete:
- ✅ Content rating
- ✅ Target audience
- ✅ News apps (if applicable - probably No)
- ✅ COVID-19 contact tracing (No)
- ✅ Data safety
- ✅ Government apps (No)
- ✅ Financial features (Declare budget/expense tracking features)
- ✅ Ads (Do you show ads? - probably No)

---

## Phase 8: Upload Your App

### Step 16: Create a Release

1. Go to **"Release" → "Production"**
2. Click **"Create new release"**
3. Choose **"Continue"** on the Play App Signing page (recommended)

### Step 17: Upload Your AAB File

1. Click **"Upload"** and select your `.aab` file from Step 7
2. Wait for the upload and processing to complete
3. Review any warnings or errors

### Step 18: Add Release Notes

Example release notes for v1.0.0:
```
🎉 Welcome to d.ai.ly v1.0.0!

Initial release featuring:
• Task management with to-do lists and reminders
• Income and expense tracking
• Budget planner with analytics
• Pomodoro timer for focused work
• Meeting scheduler
• Quick notes
• Beautiful, intuitive interface

We're excited to help you boost your productivity!
```

### Step 19: Review and Roll Out

1. Click **"Next"** to review the release
2. Set **rollout percentage** (start with 100% or staged rollout like 20%)
3. Click **"Start rollout to Production"**

---

## Phase 9: Final Review & Publishing

### Step 20: Submit for Review

1. Review all sections have green checkmarks
2. Click **"Send for review"** or **"Publish"**
3. Wait for Google's review (typically 1-7 days)

### Step 21: Track Review Status

Monitor your email and Play Console for:
- Review status updates
- Approval notification
- Any required changes

---

## Phase 10: Post-Publishing

### Step 22: Monitor Your App

After approval:
- Check the app is live on Play Store
- Test downloading and installing
- Monitor crash reports and user feedback
- Respond to user reviews

### Step 23: Share Your App

Your app will be available at:
```
https://play.google.com/store/apps/details?id=com.daily.ai
```

---

## 🔄 Updating Your App (Future Releases)

When you want to release an update:

### Step 1: Update Version Numbers
In `app.json`:
```json
{
  "expo": {
    "version": "1.0.1",  // User-facing version
    "android": {
      "versionCode": 2   // Must increment by at least 1
    }
  }
}
```

### Step 2: Build New Version
```bash
eas build --platform android --profile production
```

### Step 3: Upload to Play Console
1. Go to **"Release" → "Production"**
2. Click **"Create new release"**
3. Upload new AAB file
4. Add release notes describing changes
5. Submit for review

---

## 🛠️ Troubleshooting Common Issues

### Build Failures
- Check `eas.json` configuration
- Ensure all dependencies are properly installed
- Review build logs for specific errors
- Try: `npm install` or `yarn install` and rebuild

### App Rejected by Google
- Common reasons: Privacy policy issues, missing data safety info, misleading metadata
- Read rejection email carefully
- Fix issues and resubmit

### Crashes After Publishing
- Check Play Console crash reports
- Test on multiple Android devices
- Use Android Studio's profiler tools
- Enable proguard/R8 optimization carefully

### Upload Issues
- Ensure AAB file is properly signed
- Verify package name matches Play Console
- Check versionCode is higher than previous

---

## 📋 Quick Command Reference

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build production APK/AAB
eas build --platform android --profile production

# Build APK for testing
eas build --platform android --profile preview

# Check build status
eas build:list

# Submit to Play Store (alternative method)
eas submit --platform android
```

---

## 📚 Additional Resources

- **Google Play Console:** https://play.google.com/console
- **Expo EAS Build Docs:** https://docs.expo.dev/build/introduction/
- **Android App Bundle Guide:** https://developer.android.com/guide/app-bundle
- **Play Store Review Guidelines:** https://play.google.com/about/developer-content-policy/
- **Expo Submit:** https://docs.expo.dev/submit/introduction/

---

## ⚠️ Important Notes

1. **First Review Takes Longer:** Initial app submission can take up to 7 days
2. **Version Codes:** Always increment `versionCode` with each update
3. **Bundle ID:** Cannot be changed after first upload - choose carefully
4. **Privacy Policy:** Required for all apps - must be accessible via URL
5. **Testing:** Test thoroughly before submitting to avoid rejections
6. **Signing Keys:** EAS manages signing automatically - keep your credentials safe
7. **Rollback:** You can halt rollout if issues are discovered

---

## 🎯 Success Checklist

Before clicking "Publish," verify:
- ✅ App builds and runs without crashes
- ✅ All features tested on Android devices
- ✅ Privacy policy URL is working
- ✅ All Play Console sections have green checkmarks
- ✅ Screenshots and graphics look professional
- ✅ App description is clear and accurate
- ✅ Content rating is appropriate
- ✅ Data safety information is complete
- ✅ Version numbers are correct
- ✅ Release notes are written

---

## 🚀 Ready to Publish?

Start with **Phase 1, Step 1** and work through each phase systematically.

Good luck with your app launch! 🎉

**Questions?** Refer to the troubleshooting section or Expo/Google Play documentation.
