# Loud Notification Sounds Setup Guide

## Problem
Users report that medication notification sounds are too quiet and hard to hear.

## Solution
Add custom loud notification sound files to ensure medication reminders are audible.

## Step 1: Download Loud Sound Files

### Option A: Free Sound Websites
1. **Zapsplat** (free with attribution)
   - Search: "alarm", "bell", "alert", "notification"
   - Download: WAV format, 1-3 seconds, high volume

2. **Freesound** (free with attribution)
   - Search: "medication reminder", "alarm", "beep loud"
   - Filter: Duration < 3 seconds, high rating

3. **Mixkit** (free)
   - Search: "notification sounds"
   - Download: MP3 or WAV format

### Option B: Create Your Own
1. Use audio editing software (Audacity - free)
2. Record or create loud beep/bell sounds
3. Export as WAV format
4. Ensure high volume output

## Step 2: Add Sound Files

### Required Files (exact names):
```
assets/sounds/pill_reminder_1.wav
assets/sounds/pill_reminder_2.wav
assets/sounds/pill_reminder_3.wav
```

### File Requirements:
- **Format**: WAV (recommended) or MP3
- **Duration**: 1-3 seconds
- **Volume**: High quality, loud output
- **Size**: Under 100KB each
- **Sample Rate**: 44.1kHz
- **Bit Depth**: 16-bit

## Step 3: Technical Implementation

The app now includes:

✅ **Random Sound Selection**: Each notification uses a random sound from the 3 files
✅ **Maximum Volume**: Android channel set to MAX importance
✅ **Enhanced Priority**: High priority notifications
✅ **Visual Alerts**: LED notifications and vibration
✅ **Custom Channel**: Dedicated medication reminder channel

## Step 4: Testing

### Test the Sounds:
1. Build the app: `npm run build:android:apk`
2. Install on device
3. Create medication reminder
4. Wait for notification
5. Check volume and sound quality

### Expected Results:
- **Louder notifications** than default system sounds
- **Random sound variety** between notifications
- **High priority** display in notification shade
- **Vibration + LED** for additional alerts

## Step 5: Troubleshooting

### If Sounds Still Too Quiet:
1. **Check Device Volume**: Ensure media volume is high
2. **Check App Permissions**: Allow notifications
3. **Test Different Sounds**: Try louder sound files
4. **Check Channel Settings**: Verify channel importance is MAX

### If Sounds Don't Play:
1. **Verify File Names**: Must match exactly
2. **Check File Format**: WAV recommended
3. **Rebuild App**: Run `expo prebuild && npm run build:android:apk`
4. **Clear Cache**: Clear app data and test again

## Recommended Sound Characteristics

### Loud Medication Reminder Sounds:
- **Frequency**: 800-2000 Hz (human hearing sensitive range)
- **Duration**: 1.5-2.5 seconds
- **Pattern**: Multiple beeps (beep-beep-beep) for attention
- **Volume**: Peak at -3dB to -1dB (loud but not distorted)

### Examples:
1. **Triple Beep**: Beep-beep-beep pattern
2. **Bell Chime**: Clear bell sound
3. **Digital Alert**: Modern digital notification sound

## Implementation Details

### Code Changes Made:
- ✅ Added sound file array with random selection
- ✅ Updated Android channel for MAX importance
- ✅ Added custom sound configuration in app.json
- ✅ Enhanced notification priority and settings
- ✅ Added vibration and LED support

### Files Modified:
- `utils/notification.ts` - Updated notification logic
- `app.json` - Added sound configuration
- `assets/sounds/` - Created sound folder

## Next Steps

1. **Download 3 loud sound files**
2. **Add them to `assets/sounds/` folder**
3. **Build and test the app**
4. **Verify notification volume is loud enough**
5. **Deploy update for users**

## Sound File Sources

### Recommended Downloads:
1. **Loud Beep**: Search "loud beep sound effect"
2. **Medical Alert**: Search "medical alarm sound"
3. **Bell Reminder**: Search "bell reminder sound"

### File Naming:
- Use exact names: `pill_reminder_1.wav`, `pill_reminder_2.wav`, `pill_reminder_3.wav`
- Place in: `assets/sounds/` folder
- No spaces or special characters

Once you add the sound files, the app will automatically use them for louder medication notifications!
