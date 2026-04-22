# Google Play Release Checklist - RecuerdaMed

## Pre-Release Checklist

### 1. App Development & Testing
- [ ] All app functionality tested and working
- [ ] No critical bugs or crashes
- [ ] App works on target Android versions
- [ ] Performance is acceptable
- [ ] Memory usage is optimized
- [ ] Network connectivity handled properly
- [ ] Offline functionality works where applicable

### 2. App Assets Ready
- [ ] **Feature Graphic (1024x500px)**: `assets/google-play-feature-graphic.html` - Screenshot ready
- [ ] **Promo Graphic (180x120px)**: `assets/google-play-promo-graphic.html` - Screenshot ready
- [ ] **App Screenshots (2-8 screenshots)**: Need to capture app screens
- [ ] **App Icon**: Already configured in app.json
- [ ] **Adaptive Icons**: Already configured

### 3. Legal & Compliance
- [ ] **Privacy Policy**: `docs/privacy-policy.html` - Ready for GitHub Pages
- [ ] **Account Deletion Policy**: `docs/account-deletion.html` - Ready for GitHub Pages
- [ ] **Terms of Service**: Included in app legal screen
- [ ] **Content Rating**: Completed - Everyone (3+)
- [ ] **Permission Justification**: Document all app permissions

### 4. Store Listing
- [ ] **App Name**: RecuerdaMed
- [ ] **Short Description**: "Nunca olvides tus medicamentos. Control simple y efectivo para tu salud."
- [ ] **Full Description**: Completed in `docs/google-play-store-listing.md`
- [ ] **Category**: Health & Fitness / Medical
- [ ] **Tags/Keywords**: Completed
- [ ] **Contact Info**: Set up support email

### 5. Technical Configuration
- [ ] **Package Name**: com.pastillasapp.pastillas
- [ ] **Version Code**: Auto-increment enabled in EAS config
- [ ] **Target SDK**: Latest Android API
- [ ] **Build Configuration**: EAS production build ready
- [ ] **Signing Keys**: Set up in EAS dashboard

### 6. Live Hosting Setup
- [ ] **GitHub Pages**: Workflow configured in `.github/workflows/deploy-docs.yml`
- [ ] **Legal URLs**: https://descolle.github.io/Pastillas-Track-App/
- [ ] **Privacy Policy URL**: https://descolle.github.io/Pastillas-Track-App/privacy-policy.html
- [ ] **Account Deletion URL**: https://descolle.github.io/Pastillas-Track-App/account-deletion.html

## Google Play Console Setup

### 1. Create Application
- [ ] Create new app in Google Play Console
- [ ] Enter app details (name, package name)
- [ ] Select app category (Health & Fitness)
- [ ] Complete contact information

### 2. Store Listing
- [ ] Upload app screenshots (2-8)
- [ ] Upload feature graphic (1024x500px)
- [ ] Upload promo graphic (180x120px)
- [ ] Add app description and details
- [ ] Set up release notes

### 3. Content Rating
- [ ] Complete content rating questionnaire
- [ ] Use answers from `docs/content-rating-guide.md`
- [ ] Confirm rating: Everyone (3+)

### 4. Pricing & Distribution
- [ ] Set app price (Free)
- [ ] Select distribution countries
- [ ] Set content guidelines
- [ ] Configure app content

### 5. App Releases
- [ ] Set up internal testing track
- [ ] Add test accounts
- [ ] Upload production build (AAB)
- [ ] Complete release checklist

### 6. App Permissions
- [ ] Document all permissions used
- [ ] Add permission justifications
- [ ] Ensure privacy policy covers all data collection

## Build & Upload Process

### 1. Production Build
```bash
# Build production AAB
npm run build:android:aab

# Or using EAS CLI directly
npx eas-cli build --platform android --profile production
```

### 2. Upload to Google Play
- [ ] Download AAB from EAS dashboard
- [ ] Upload to Google Play Console
- [ ] Complete release form
- [ ] Set up rollout (staged release recommended)

## Post-Release Checklist

### 1. Monitoring
- [ ] Monitor crash reports
- [ ] Check ANR (Application Not Responding) reports
- [ ] Monitor user reviews and ratings
- [ ] Track download statistics

### 2. Support
- [ ] Set up user support channel
- [ ] Monitor feedback and bug reports
- [ ] Prepare quick response templates
- [ ] Plan for regular updates

### 3. Marketing
- [ ] Share app on social media
- [ ] Create promotional materials
- [ ] Reach out to health communities
- [ ] Consider app store optimization (ASO)

## Required URLs for Google Play

### Legal Documents (GitHub Pages)
- **Privacy Policy**: https://descolle.github.io/Pastillas-Track-App/privacy-policy.html
- **Account Deletion**: https://descolle.github.io/Pastillas-Track-App/account-deletion.html
- **Main Legal Page**: https://descolle.github.io/Pastillas-Track-App/

### Support Contact
- **Email**: support@pastillasapp.com (to be configured)
- **Website**: https://descolle.github.io/Pastillas-Track-App/

## Final Steps Before Release

1. **Enable GitHub Pages** in repository settings
2. **Trigger GitHub Actions** workflow to deploy docs
3. **Verify legal URLs** are accessible
4. **Complete final testing** of all app features
5. **Create production build** and test on device
6. **Set up Google Play Console** account and app listing
7. **Upload all assets** and complete store listing
8. **Submit for review** and wait for approval

## Notes

- All assets are created as HTML files for easy screenshotting
- Legal documents are ready for GitHub Pages deployment
- Content rating is set to Everyone (3+) for maximum reach
- EAS build configuration is optimized for production
- Store listing content is professional and comprehensive

## Timeline Estimate

- **Asset Creation**: 1-2 hours (screenshots)
- **GitHub Pages Setup**: 30 minutes
- **Google Play Console Setup**: 2-3 hours
- **Build & Upload**: 1-2 hours
- **Review Process**: 1-3 days (Google Play review)

**Total Estimated Time**: 1-2 days for complete release
