# Production Build Guide - RecuerdaMed

## Step 1: Create Production AAB Build

### Option A: Using npm scripts (Recommended)
```bash
# Build production AAB for Google Play
npm run build:android:aab
```

### Option B: Using EAS CLI directly
```bash
# Build production AAB
npx eas-cli build --platform android --profile production
```

### Option C: Build APK (for testing)
```bash
# Build APK for internal testing
npm run build:android:apk
```

## Step 2: Google Play Developer Account Setup

### 2.1 Create Developer Account
1. Go to [Google Play Console](https://play.google.com/console/)
2. Click "Create account"
3. Pay the **$25 one-time developer fee**
4. Complete account verification

### 2.2 Create New App
1. In Play Console, click "Create app"
2. Fill in app details:
   - **App name**: RecuerdaMed
   - **Default language**: Spanish
   - **App or game**: App
   - **Free or paid**: Free
   - **Contains ads**: No
3. Click "Create app"

## Step 3: Store Listing Setup

### 3.1 App Information
- **App name**: RecuerdaMed
- **Short description**: Nunca olvides tus medicamentos. Control simple y efectivo para tu salud.
- **Full description**: Use content from `docs/google-play-store-listing.md`

### 3.2 Upload Assets
- **Feature Graphic**: Screenshot from `assets/google-play-feature-graphic.html`
- **Promo Graphic**: Screenshot from `assets/google-play-promo-graphic.html`
- **App Screenshots**: Take 2-8 screenshots of the app

### 3.3 Content Rating
- Use answers from `docs/content-rating-guide.md`
- Rating: Everyone (3+)

## Step 4: App Release

### 4.1 Internal Testing
1. Go to "Internal testing"
2. Create release
3. Upload your AAB file from Step 1
4. Add test users
5. Roll out to testers

### 4.2 Production Release
1. Go to "Production"
2. Create new release
3. Upload AAB file
4. Complete release notes
5. Review and roll out

## Step 5: Legal Documents Setup

### 5.1 Enable GitHub Pages
1. Go to your GitHub repository
2. Settings > Pages
3. Source: Deploy from a branch
4. Branch: main / (root)
5. Save

### 5.2 Trigger GitHub Actions
1. Push changes to trigger docs deployment
2. Wait for GitHub Pages to go live
3. Verify URLs are accessible:
   - Privacy Policy: https://descolle.github.io/Pastillas-Track-App/privacy-policy.html
   - Account Deletion: https://descolle.github.io/Pastillas-Track-App/account-deletion.html

## Step 6: Build Commands Reference

### Production Build Commands
```bash
# Install EAS CLI (if not installed)
npm install -g @expo/eas-cli

# Login to EAS
npx eas-cli login

# Build production AAB
npx eas-cli build --platform android --profile production

# Build APK for testing
npx eas-cli build --platform android --profile preview
```

### Alternative: Expo CLI
```bash
# Build with Expo CLI
expo build:android --type app-bundle
```

## Step 7: Post-Upload Checklist

### 7.1 Required Information
- [x] App name and description
- [x] Store listing content
- [x] Feature graphic (1024x500px)
- [x] Promo graphic (180x120px)
- [x] App screenshots (2-8)
- [x] Content rating
- [x] Privacy policy URL
- [x] Account deletion URL

### 7.2 Technical Requirements
- [x] Target SDK: Latest Android API
- [x] App signing configured
- [x] AAB file uploaded
- [x] Release notes added

## Step 8: Common Issues & Solutions

### Build Issues
- **Node version**: Use Node 18+ LTS
- **EAS CLI**: Update to latest version
- **Dependencies**: Run `npm install` before build

### Upload Issues
- **File size**: AAB should be under 150MB
- **Permissions**: Ensure all permissions are justified
- **Content rating**: Complete questionnaire accurately

### Review Process
- **Timing**: Google Play review takes 1-3 days
- **Rejection**: Common reasons are missing permissions or policy violations
- **Appeals**: Provide additional information if requested

## Step 9: Timeline Estimate

| Step | Time Required |
|------|---------------|
| Build AAB | 30-60 minutes |
| Developer Account | 15-30 minutes |
| Store Listing | 1-2 hours |
| Upload & Review | 1-3 days |
| **Total** | **2-4 days** |

## Step 10: Cost Summary

| Item | Cost |
|------|------|
| Google Play Developer Fee | $25 (one-time) |
| Build Process | Free |
| GitHub Pages | Free |
| **Total Cost** | **$25** |

## Step 11: Quick Start Commands

```bash
# 1. Build production AAB
npm run build:android:aab

# 2. Go to Google Play Console
# https://play.google.com/console/

# 3. Pay developer fee ($25)

# 4. Upload AAB and complete store listing

# 5. Submit for review
```

## Step 12: Support Resources

- **Google Play Console Help**: https://support.google.com/googleplay/android-developer
- **EAS Build Documentation**: https://docs.expo.dev/build/introduction/
- **Expo Router Guide**: https://docs.expo.dev/router/introduction/

## Important Notes

1. **AAB vs APK**: Google Play requires AAB (Android App Bundle) format
2. **Signing**: EAS handles app signing automatically
3. **Version Code**: Auto-increment is configured in eas.json
4. **Testing**: Always test in internal track before production
5. **Legal**: Ensure all legal URLs are accessible before submission

## Success Metrics

After submission, monitor:
- **Download statistics**
- **Crash reports** 
- **User reviews**
- **ANR (Application Not Responding) reports**

Your app is ready for Google Play submission! Follow these steps systematically for a successful launch.
