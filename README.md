# MEERA - Horror Invitation Site

## What Changed to Fix Autoplay on Netlify

The audio autoplay issue on Netlify has been fixed! Here's what was changed:

### The Problem
Browsers block autoplay with sound unless there's a user interaction first. Localhost is more permissive, but production sites like Netlify enforce strict autoplay policies.

### The Solution
1. **Added an ENTER button overlay** in `index.html` that users must click before entering the site
2. **User interaction event** - When clicked, it dispatches a `userInteracted` event
3. **React listens for the event** - `App.tsx` listens for this event and triggers audio playback
4. **Guaranteed autoplay** - Because the audio starts AFTER a user click, it will always play

### Files Modified

1. **index.html** - Added ENTER button overlay with horror-themed styling
2. **App.tsx** - 
   - Removed the old start screen
   - Added `userInteracted` state
   - Listens for the `userInteracted` event from the ENTER button
   - Passes `userInteracted` instead of `started` to `SoundManager`
3. **SoundManager.tsx** - Improved audio playback handling

## How to Deploy to Netlify

1. Make sure all files are in your project directory
2. Build the project:
   ```bash
   npm install
   npm run build
   ```
3. Deploy the `dist` folder to Netlify
4. The audio will now autoplay after users click the ENTER button! 🎃

## Project Structure

```
/
├── components/
│   ├── Cursor.tsx
│   ├── SoundManager.tsx
│   └── Ritual.tsx
├── public/
│   └── meera-audio.mp3
├── App.tsx
├── index.html
├── index.tsx
├── types.ts
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Local Development

```bash
npm install
npm run dev
```

Visit http://localhost:5173

## The Flow

1. User lands on page → sees horror-themed ENTER button
2. User clicks ENTER → triggers `userInteracted` event
3. Overlay fades out
4. React receives event → starts audio playback ✅
5. Horror experience begins with audio playing

This approach is **100% compliant** with browser autoplay policies and will work on Netlify, Vercel, GitHub Pages, and all other hosting platforms!
