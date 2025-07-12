# Sarah & Michael's Wedding Website

A beautiful, responsive wedding website built with modern HTML, CSS (Tailwind), and JavaScript.

## Features

### 🏠 Home Page
- Couple's names and wedding date (September 7, 2025)
- Live countdown timer to the big day
- Welcome message
- Quick links to RSVP and Event Details

### 📅 Event Details
- Ceremony information (time, location, address)
- Reception details
- Placeholder for Google Maps integration
- Dress code guidelines
- Additional notes and tips

### 📝 RSVP System
- **Web Form**: Name, phone number, attendance (Yes/No), optional notes
- **WhatsApp Integration**: Dynamic form that sends filled details to +263 78 537 5924 (Zimbabwe)
- **Confirmation**: Success message on form submission
- **Data Storage**: All responses saved locally in browser
- **Method Tracking**: Dashboard shows whether RSVP came via web form or WhatsApp

### 🚗 Travel & Accommodation
- Recommended hotels with pricing
- Travel tips and transportation options
- Contact information for logistics

### 📞 Contact
- WhatsApp chat link
- Email contact
- Phone numbers
- Wedding coordinator details

### 🔧 Admin Panel (Hidden)
- **Access**: Add `#admin` to the URL (e.g., `index.html#admin`)
- **Features**:
  - View all RSVP submissions in a table
  - Export guest list as CSV file
  - Mobile-responsive design
  - No login required (for simplicity)

## Setup Instructions

1. **Download/Clone** the project files
2. **Open** `index.html` in a web browser
3. **Customize** the content:
   - Update couple names in the HTML
   - Change wedding date in `script.js` (line 25)
   - Update venue details in the Event Details section
   - Modify contact information
   - Replace placeholder phone numbers with real ones

## Customization Guide

### Changing the Wedding Date
Edit line 25 in `script.js`:
```javascript
const weddingDate = new Date('September 7, 2025 14:00:00').getTime();
```

### Updating Contact Information
- **WhatsApp**: Update the phone number in the WhatsApp links
- **Email**: Change the email address in the Contact section
- **Phone**: Update all phone numbers throughout the site

### Adding Google Maps
Replace the placeholder map div in the Event Details section with actual Google Maps embed code.

### Styling Customization
The website uses Tailwind CSS with a custom wedding color palette. You can modify colors in the `tailwind.config` section of the HTML file.

## Technical Details

- **Framework**: Vanilla HTML, CSS, JavaScript
- **Styling**: Tailwind CSS (CDN)
- **Fonts**: Inter (sans-serif) and Playfair Display (serif)
- **Icons**: Font Awesome
- **Data Storage**: Browser localStorage
- **Responsive**: Mobile-first design

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## File Structure

```
wedding/
├── index.html          # Main website file
├── script.js           # JavaScript functionality
└── README.md          # This file
```

## Admin Access

To access the admin panel:
1. Open the website
2. Add `#admin` to the URL
3. Example: `http://localhost/index.html#admin`

The admin panel shows:
- All RSVP submissions with method (Web Form/WhatsApp)
- Attendance statistics
- Export functionality for CSV download

## Notes

- All RSVP data is stored locally in the browser
- No server-side processing required
- Works offline after initial load
- Sample RSVP data is included for demonstration

## Support

For questions or customization help, please refer to the code comments or contact the developer.

---

*Built with ❤️ for Sarah & Michael's special day* 