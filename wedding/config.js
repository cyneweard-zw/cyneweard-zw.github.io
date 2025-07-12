// Wedding Website Configuration
// Replace the URL below with your actual Google Sheets Web App URL

const CONFIG = {
    // Google Sheets Web App URL (get this from your Google Apps Script deployment)
    GOOGLE_SHEETS_URL: 'https://script.google.com/macros/s/AKfycbxjBtxE-SFoiA3bRLCo8KXjZPZiyAw4vCyjhldBlT5OiMDvQ9C8fr1aWJwGvW_ceIHx/exec',
    
    // WhatsApp number for RSVP
    WHATSAPP_NUMBER: '263785375924',
    
    // Wedding date (used for countdown)
    WEDDING_DATE: 'September 7, 2025 14:00:00',
    
    // Couple names
    COUPLE_NAMES: 'Sarah & Michael',
    
    // Admin access (add #admin to URL to access dashboard)
    ADMIN_ENABLED: true
};

// Example Google Sheets URL format:
// https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

// To get your Google Sheets URL:
// 1. Go to your Google Sheet
// 2. Extensions > Apps Script
// 3. Deploy > New deployment
// 4. Choose "Web app"
// 5. Set access to "Anyone"
// 6. Copy the Web App URL
// 7. Paste it above replacing 'YOUR_GOOGLE_SHEETS_WEB_APP_URL_HERE' 