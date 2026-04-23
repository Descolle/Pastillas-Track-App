# RecuerdaMed - Google Play Quick Start Guide

## Step 1: Build Production AAB
```bash
npm run build:android:aab
```
Wait 30-60 minutes for build to complete. Download the .aab file.

## Step 2: Google Play Console Setup
1. Go to [play.google.com/console](https://play.google.com/console)
2. Click "Create account" 
3. Pay $25 developer fee (one-time)
4. Click "Create app"

## Step 3: App Information
- **App name**: RecuerdaMed
- **Default language**: Spanish
- **App or game**: App
- **Free or paid**: Free
- **Contains ads**: No

## Step 4: Store Listing
### Short Description (80 chars max):
```
Nunca olvides tus medicamentos. Control simple y efectivo para tu salud.
```

### Full Description:
Copy from `docs/google-play-store-listing.md`

## Step 5: Upload Assets
### Required Graphics:
1. **Feature Graphic (1024x500px)**: 
   - Open `assets/google-play-feature-graphic.html` in browser
   - Take screenshot (1024x500 pixels)
   
2. **Promo Graphic (180x120px)**:
   - Open `assets/google-play-promo-graphic.html` in browser  
   - Take screenshot (180x120 pixels)
   
3. **App Screenshots (2-8)**:
   - Take screenshots of your app screens
   - Include: Home, Create, Profile, Edit screens

## Step 6: Content Rating
- **Rating**: Everyone (3+)
- **Answers**: Use `docs/content-rating-guide.md`
- No violence, no inappropriate content, medical app only

## Step 7: Legal URLs
Set these in Store Listing:
- **Privacy Policy**: https://descolle.github.io/Pastillas-Track-App/privacy-policy.html
- **Account Deletion**: https://descolle.github.io/Pastillas-Track-App/account-deletion.html

## Step 8: Upload Build
1. Go to "Release" > "Production"
2. Click "Create new release"
3. Upload your .aab file
4. Add release notes: "Initial release of RecuerdaMed"
5. Click "Save" then "Review release"

## Step 9: Submit for Review
1. Complete all required fields
2. Click "Start rollout to production"
3. Wait 1-3 days for Google Play review

## Timeline
- **Build**: 30-60 minutes
- **Setup**: 1-2 hours
- **Review**: 1-3 days
- **Total**: 2-4 days

## Cost
- **Google Play Fee**: $25 (one-time)
- **Everything else**: Free

## Troubleshooting
- **Build fails**: Run `npm install` first
- **Upload fails**: Check file size (<150MB)
- **Review rejected**: Check permissions and content rating

## Success!
Once approved, your app will be live on Google Play Store worldwide.

---
**Quick Reference Commands:**
```bash
# Build production AAB
npm run build:android:aab

# Build APK for testing  
npm run build:android:apk

# Google Play Console
https://play.google.com/console
```

**Important Files:**
- Store listing: `docs/google-play-store-listing.md`
- Content rating: `docs/content-rating-guide.md`
- Feature graphic: `assets/google-play-feature-graphic.html`
- Promo graphic: `assets/google-play-promo-graphic.html`
