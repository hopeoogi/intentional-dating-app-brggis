
# Intro Video Setup Guide

## 📹 Current Status

The app currently uses a **remote image** from the database:
- URL: `https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1920&h=1080&fit=crop`
- Type: Image (not video)
- Duration: 3 seconds
- Enabled: Yes

## 🎬 To Add a Local Video (Optional)

If you want to bundle a video with the app to increase the app size and provide offline support:

### Step 1: Create or Obtain a Video

**Option A: Use a Video Editor**
1. Create a 5-10 second video with your branding
2. Export as MP4 (H.264 codec)
3. Resolution: 1080x1920 (portrait) or 1920x1080 (landscape)
4. File size: 5-20 MB

**Option B: Use FFmpeg to Generate**
```bash
# Simple black background with text
ffmpeg -f lavfi -i color=c=black:s=1080x1920:d=5 \
  -vf "drawtext=text='Intentional':fontsize=80:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2-50,\
       drawtext=text='Where connections matter':fontsize=40:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2+50" \
  -c:v libx264 -t 5 -pix_fmt yuv420p assets/intro-video.mp4

# With a gradient background
ffmpeg -f lavfi -i "color=c=0x1a1a2e:s=1080x1920:d=5,format=rgb24,\
  geq=r='255*sin(X/100)':g='255*sin(Y/100)':b='255*cos(X/100+Y/100)'" \
  -vf "drawtext=text='Intentional':fontsize=80:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2-50,\
       drawtext=text='Where connections matter':fontsize=40:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2+50" \
  -c:v libx264 -t 5 -pix_fmt yuv420p assets/intro-video.mp4
```

### Step 2: Place the Video File
```bash
# Place your video in the assets folder
cp your-intro-video.mp4 assets/intro-video.mp4
```

### Step 3: Update the Code (Already Done)
The code in `app/intro-video.tsx` is already set up to use a local video as a fallback. No changes needed!

### Step 4: Rebuild the App
```bash
# Clear cache and rebuild
rm -rf node_modules/.cache && rm -rf .expo
eas build --platform ios --profile production
```

## 📊 Current Setup (No Local Video)

The app currently works perfectly **without** a local video:
1. Fetches intro settings from database
2. Displays remote image for 3 seconds
3. Shows skip button after 2 seconds
4. Navigates to sign-in screen

**This is perfectly fine!** The small app size (28.7MB) is actually a good thing.

## 🎯 When to Add a Local Video

Consider adding a local video if:
- You want offline support (app works without internet)
- You want faster loading (no network request)
- You want to increase app size (for some reason)
- You have a custom branded video

## 🚫 When NOT to Add a Local Video

Don't add a local video if:
- You want to keep app size small ✅
- You want to update the video without app updates ✅
- You want to A/B test different videos ✅
- You want to disable the intro remotely ✅

## 🔄 How to Update the Intro Video

### Option 1: Update Database (Recommended)
```sql
-- Update the intro video URL in the database
UPDATE app_settings
SET setting_value = jsonb_set(
  setting_value,
  '{url}',
  '"https://your-new-video-url.mp4"'
)
WHERE setting_key = 'intro_video';

-- Or update the entire setting
UPDATE app_settings
SET setting_value = '{
  "url": "https://your-new-video-url.mp4",
  "enabled": true,
  "duration": 5000
}'::jsonb
WHERE setting_key = 'intro_video';
```

**Advantages**:
- No app update required
- Instant changes
- Can A/B test different videos
- Can disable remotely

### Option 2: Update Local Video
1. Replace `assets/intro-video.mp4` with new video
2. Rebuild and redeploy app

**Advantages**:
- Works offline
- Faster loading
- No database dependency

## 📝 Recommended Approach

**For now**: Keep using the remote image from the database
- It's working perfectly
- Small app size
- Easy to update
- No rebuild required

**Later**: Consider adding a local video if you need offline support or have a custom branded video.

## 🎨 Video Specifications

If you do create a video:
- **Format**: MP4 (H.264 codec)
- **Resolution**: 1080x1920 (portrait) or 1920x1080 (landscape)
- **Duration**: 5-10 seconds
- **File Size**: 5-20 MB
- **Frame Rate**: 30 fps
- **Audio**: Optional (can be muted)

## 🔍 Testing

After adding a local video:
1. Launch app
2. Video should play automatically
3. Skip button appears after 2 seconds
4. Video ends or user skips
5. App navigates to sign-in

## 📞 Support

If you need help creating a video:
1. Use a video editing tool (iMovie, Adobe Premiere, etc.)
2. Use online tools (Canva, Kapwing, etc.)
3. Use FFmpeg (see commands above)
4. Hire a designer on Fiverr or Upwork

## ✅ Current Status: Working Perfectly

The app is currently working great with the remote image. No need to add a local video unless you specifically want to!
