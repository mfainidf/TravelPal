# TravelPal 🌍

Your Personal Travel Companion - Discover, organize, and get AI-powered travel suggestions.

## Features

### 📍 Best Locations Management
- Add and manage your list of favorite travel destinations
- Simple and intuitive interface
- Persistent storage using localStorage

### 🤖 AI-Powered Suggestions (Optional)
Get personalized travel recommendations using Google's Gemini AI. This feature is:
- **Completely optional** - the app works fully without it
- **Privacy-focused** - your API key stays in your browser only
- **Session-based** - API key is cleared when you close the browser

## Getting Started

### Basic Usage (No API Key Required)
1. Open `index.html` in a web browser
2. Click on the "Best Locations" tab
3. Add locations manually using the input field
4. Manage your list of favorite places

### Using AI Suggestions (Requires Google Gemini API Key)

#### Step 1: Get a Google Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

#### Step 2: Use AI Suggestions
1. In the "Best Locations" tab, scroll to the "AI-Powered Suggestions" section
2. Enter a destination or interest (e.g., "Paris", "beach destinations", "cultural sites in Japan")
3. Click "Get Gemini AI Suggestions"
4. On first use, you'll be prompted to enter your API key
5. View AI-generated suggestions and add them to your locations list with one click

## Privacy & Security

### API Key Storage
- Your Google Gemini API key is stored **only** in `sessionStorage`
- It is **never sent to any server** except Google's Gemini API
- It is **automatically cleared** when you close your browser
- It is **not accessible** to other websites or applications

### Data Storage
- Your locations list is stored in `localStorage` on your device
- No data is sent to any external servers (except the Gemini API when you use that feature)
- You have full control over your data

## Technical Details

### API Integration
- Uses Google Gemini Pro model via REST API
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`
- Requests are made client-side using `fetch()`

### Error Handling
- Invalid API key detection with user-friendly messages
- Network error handling
- Empty input validation
- Duplicate location prevention

### Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Uses ES6+ features (classes, arrow functions, async/await)

## File Structure

```
TravelPal/
├── index.html      # Main HTML structure
├── styles.css      # Application styling
├── app.js          # Core JavaScript logic
└── README.md       # This file
```

## Development

No build process required! Simply edit the HTML, CSS, or JavaScript files and refresh your browser.

### Customization
- Modify `styles.css` to change the appearance
- Edit `app.js` to adjust functionality
- Update the AI prompt in `fetchSuggestions()` to customize suggestion types

## Troubleshooting

### "Invalid API key" error
- Ensure you copied the complete API key from Google AI Studio
- Try generating a new API key
- Check that the API key hasn't been restricted or revoked

### No suggestions appearing
- Check your browser's console for error messages (F12 > Console)
- Ensure you have an active internet connection
- Try with a simpler destination query (e.g., "Tokyo" instead of a long description)

### API key keeps being requested
- This is normal - the API key is cleared when you close the browser for security
- If it's being requested within the same session, check if you're in private/incognito mode

## License

This is a demonstration application. Feel free to use and modify as needed.

## Support

For issues related to:
- The app itself: Check the code or create an issue in the repository
- Google Gemini API: Visit [Google AI documentation](https://ai.google.dev/docs)

---

**Note:** This application requires you to have your own Google Gemini API key to use AI features. API usage may be subject to Google's pricing and rate limits.
