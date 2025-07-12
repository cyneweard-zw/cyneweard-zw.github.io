// Navigation functionality
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Update navigation links
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current nav item
    event.target.classList.add('active');
    
    // Close mobile menu
    document.getElementById('mobile-menu').classList.add('hidden');
}

// Mobile menu toggle
document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
});

// Countdown timer
function updateCountdown() {
    const weddingDate = new Date('September 7, 2025 14:00:00').getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    } else {
        document.getElementById('countdown').innerHTML = '<div class="text-3xl font-serif text-wedding-800">Today is the day!</div>';
    }
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// Use configuration from config.js
const GOOGLE_SHEETS_URL = CONFIG.GOOGLE_SHEETS_URL;

// RSVP Form handling
document.getElementById('rsvpForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const rsvpData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        method: 'Web Form',
        attendance: formData.get('attendance'),
        transport: formData.get('transport') || null,
        notes: formData.get('notes'),
        date: new Date().toISOString()
    };
    
    // Show loading state
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    try {
        // Send to Google Sheets
        const success = await submitToGoogleSheets(rsvpData);
        
        if (success) {
            // Also store in localStorage as backup
            let rsvps = JSON.parse(localStorage.getItem('rsvps') || '[]');
            rsvps.push(rsvpData);
            localStorage.setItem('rsvps', JSON.stringify(rsvps));
            
            // Show success message
            document.getElementById('confirmation').classList.remove('hidden');
            document.getElementById('confirmation').innerHTML = `
                <i class="fas fa-check-circle mr-2"></i>
                Thank you for your RSVP! We've received your response and look forward to celebrating with you.
            `;
            
            // Reset form
            this.reset();
            document.getElementById('transportSection').classList.add('hidden');
        } else {
            // Fallback to localStorage only
            let rsvps = JSON.parse(localStorage.getItem('rsvps') || '[]');
            rsvps.push(rsvpData);
            localStorage.setItem('rsvps', JSON.stringify(rsvps));
            
            document.getElementById('confirmation').classList.remove('hidden');
            document.getElementById('confirmation').innerHTML = `
                <i class="fas fa-check-circle mr-2"></i>
                RSVP submitted successfully! Your response has been recorded.
            `;
        }
    } catch (error) {
        console.error('Error submitting RSVP:', error);
        
        // Fallback to localStorage
        let rsvps = JSON.parse(localStorage.getItem('rsvps') || '[]');
        rsvps.push(rsvpData);
        localStorage.setItem('rsvps', JSON.stringify(rsvps));
        
        document.getElementById('confirmation').classList.remove('hidden');
        document.getElementById('confirmation').innerHTML = `
            <i class="fas fa-check-circle mr-2"></i>
            RSVP submitted successfully! Your response has been recorded.
        `;
    } finally {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Hide confirmation after 5 seconds
        setTimeout(() => {
            document.getElementById('confirmation').classList.add('hidden');
        }, 5000);
    }
});

// Admin functionality
function loadRSVPs() {
    const rsvps = JSON.parse(localStorage.getItem('rsvps') || '[]');
    const tableBody = document.getElementById('rsvpTableBody');
    
    tableBody.innerHTML = '';
    
            rsvps.forEach(rsvp => {
            const row = document.createElement('tr');
            const transportText = rsvp.transport ? (rsvp.transport === 'yes' ? 'Needs Transport' : 'Own Transport') : '-';
            const transportClass = rsvp.transport === 'yes' ? 'bg-orange-100 text-orange-800' : rsvp.transport === 'no' ? 'bg-gray-100 text-gray-800' : '';
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${rsvp.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${rsvp.phone || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${rsvp.method === 'Web Form' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}">
                        ${rsvp.method || 'WhatsApp'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${rsvp.attendance === 'yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${rsvp.attendance === 'yes' ? 'Attending' : 'Not Attending'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${rsvp.transport ? `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transportClass}">${transportText}</span>` : '-'}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">${rsvp.notes || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(rsvp.date).toLocaleDateString()}</td>
            `;
            tableBody.appendChild(row);
        });
    
    // Update counts
    const attending = rsvps.filter(r => r.attendance === 'yes').length;
    const notAttending = rsvps.filter(r => r.attendance === 'no').length;
    
    document.getElementById('totalResponses').textContent = rsvps.length;
    document.getElementById('attendingCount').textContent = attending;
    document.getElementById('notAttendingCount').textContent = notAttending;
}

function exportCSV() {
    const rsvps = JSON.parse(localStorage.getItem('rsvps') || '[]');
    
    if (rsvps.length === 0) {
        alert('No RSVP data to export');
        return;
    }
    
    // Create CSV content
    const headers = ['Name', 'Phone', 'Method', 'Attendance', 'Transport', 'Notes', 'Date'];
    const csvContent = [
        headers.join(','),
        ...rsvps.map(rsvp => [
            `"${rsvp.name}"`,
            `"${rsvp.phone || ''}"`,
            rsvp.method || 'WhatsApp',
            rsvp.attendance === 'yes' ? 'Attending' : 'Not Attending',
            rsvp.transport === 'yes' ? 'Needs Transport' : rsvp.transport === 'no' ? 'Own Transport' : '',
            `"${rsvp.notes || ''}"`,
            new Date(rsvp.date).toLocaleDateString()
        ].join(','))
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wedding-rsvps-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Google Sheets submission function (Improved CORS handling)
async function submitToGoogleSheets(rsvpData) {
    if (!GOOGLE_SHEETS_URL || GOOGLE_SHEETS_URL === 'YOUR_GOOGLE_SHEETS_WEB_APP_URL_HERE') {
        console.warn('Google Sheets URL not configured');
        return false;
    }
    
    try {
        // Method 1: Try direct POST with proper headers
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            body: JSON.stringify(rsvpData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            console.log('RSVP submitted to Google Sheets successfully');
            return true;
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Primary method failed:', error);
        
        // Method 2: Try with no-cors mode as fallback
        try {
            const response2 = await fetch(GOOGLE_SHEETS_URL, {
                method: 'POST',
                body: JSON.stringify(rsvpData),
                mode: 'no-cors'
            });
            
            console.log('RSVP sent using no-cors mode - check Google Sheets to confirm');
            return true; // Assume success with no-cors
        } catch (error2) {
            console.error('Both methods failed:', error2);
            return false;
        }
    }
}

// Dynamic WhatsApp RSVP function
async function sendWhatsAppRSVP() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const attendance = document.querySelector('input[name="attendance"]:checked');
    const transport = document.querySelector('input[name="transport"]:checked');
    const notes = document.getElementById('notes').value.trim();
    
    if (!name || !phone || !attendance) {
        alert('Please fill in your name, phone number, and select attendance before sending WhatsApp RSVP.');
        return;
    }
    
    const attendanceText = attendance.value === 'yes' ? 'Yes, I/We will attend' : 'No, I/We cannot attend';
    const transportText = transport ? (transport.value === 'yes' ? 'Yes, I/We need transport' : 'No, I/We have our own transport') : '';
    const notesText = notes ? `\nNotes: ${notes}` : '';
    
    let message = `Hi! I'd like to RSVP for Sarah and Michael's wedding.

Name: ${name}
Phone: ${phone}
Attendance: ${attendanceText}`;

    if (transportText) {
        message += `\nTransport: ${transportText}`;
    }
    
    message += notesText;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/263785375924?text=${encodedMessage}`;
    
    // Store as WhatsApp RSVP
    const rsvpData = {
        name: name,
        phone: phone,
        method: 'WhatsApp',
        attendance: attendance.value,
        transport: transport ? transport.value : null,
        notes: notes,
        date: new Date().toISOString()
    };
    
    // Try to submit to Google Sheets first
    try {
        await submitToGoogleSheets(rsvpData);
    } catch (error) {
        console.error('Failed to submit WhatsApp RSVP to Google Sheets:', error);
    }
    
    // Always store in localStorage as backup
    let rsvps = JSON.parse(localStorage.getItem('rsvps') || '[]');
    rsvps.push(rsvpData);
    localStorage.setItem('rsvps', JSON.stringify(rsvps));
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Show confirmation
    document.getElementById('confirmation').classList.remove('hidden');
    document.getElementById('confirmation').innerHTML = `
        <i class="fas fa-check-circle mr-2"></i>
        WhatsApp opened! Your RSVP has been recorded.
    `;
    setTimeout(() => {
        document.getElementById('confirmation').classList.add('hidden');
    }, 5000);
}

// Load RSVPs when admin page is shown
document.addEventListener('DOMContentLoaded', function() {
    // Check if admin page is accessed
    if (window.location.hash === '#admin') {
        showPage('admin');
        loadRSVPs();
    }
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Handle transport section visibility based on attendance
    document.querySelectorAll('input[name="attendance"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const transportSection = document.getElementById('transportSection');
            if (this.value === 'yes') {
                transportSection.classList.remove('hidden');
            } else {
                transportSection.classList.add('hidden');
                // Clear transport selection when hiding
                document.querySelectorAll('input[name="transport"]').forEach(t => t.checked = false);
            }
        });
    });
});

// Add some sample RSVP data for demonstration
if (!localStorage.getItem('rsvps')) {
    const sampleRSVPs = [
        {
            name: 'John Smith',
            phone: '+263 78 123 4567',
            method: 'Web Form',
            attendance: 'yes',
            transport: 'yes',
            notes: 'Looking forward to it!',
            date: new Date('2024-12-01').toISOString()
        },
        {
            name: 'Sarah Johnson',
            phone: '+263 77 987 6543',
            method: 'WhatsApp',
            attendance: 'yes',
            transport: 'no',
            notes: 'Vegetarian meal please',
            date: new Date('2024-12-02').toISOString()
        },
        {
            name: 'Mike Wilson',
            phone: '+263 71 555 1234',
            method: 'Web Form',
            attendance: 'no',
            transport: null,
            notes: 'Sorry, we have a prior commitment',
            date: new Date('2024-12-03').toISOString()
        }
    ];
    localStorage.setItem('rsvps', JSON.stringify(sampleRSVPs));
} 