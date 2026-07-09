# Audio Files Setup

To enable sound effects on the website, you need to add the following audio files to the `public` folder:

## Required Files

### 1. Background Music
- **Path**: `public/music/background.mp3`
- **Description**: Background music that plays throughout the website at low volume (20%)
- **Format**: MP3 recommended
- **Duration**: Can be any length (will loop automatically)

### 2. Button Hover Sound
- **Path**: `public/sounds/button-hover.mp3`
- **Description**: Sound effect that plays when hovering over buttons (plays once per hover)
- **Format**: MP3 recommended
- **Duration**: Short sound effect (0.5-2 seconds recommended)
- **Volume**: Set to 50% in code

## File Structure

```
public/
  ├── music/
  │   └── background.mp3
  └── sounds/
      └── button-hover.mp3
```

## Notes

- The background music will start playing after the first user interaction (click, touch, or keypress) due to browser autoplay restrictions
- Button hover sounds are throttled to play once every 300ms to prevent audio spam
- If audio files are not found, the website will continue to work without sound (errors are silently handled)

## Alternative Formats

You can use other audio formats (`.wav`, `.ogg`, `.m4a`) by updating the file extensions in:
- `components/audio/BackgroundMusic.tsx` (line 15)
- `hooks/useButtonSound.ts` (line 20)

