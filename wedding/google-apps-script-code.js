// Google Apps Script Code for Wedding RSVP System
// Copy this code into your Google Apps Script editor

function doGet(e) {
  // Handle GET requests for fetching data
  if (e.parameter.action === 'getData') {
    return getRSVPData();
  }
  
  // Default response
  return ContentService.createTextOutput('Wedding RSVP System')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  // Handle POST requests for submitting RSVPs
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Add timestamp
    var timestamp = new Date();
    
    // Append to sheet
    sheet.appendRow([
      data.name,
      data.phone || '',
      data.method || 'Web Form',
      data.attendance === 'yes' ? 'Attending' : 'Not Attending',
      data.transport === 'yes' ? 'Needs Transport' : data.transport === 'no' ? 'Own Transport' : '',
      data.notes || '',
      timestamp
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'RSVP submitted successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getRSVPData() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    
    // Skip header row if it exists
    var startRow = 1;
    if (data.length > 0 && data[0][0] === 'Name') {
      startRow = 1;
    }
    
    var rsvps = [];
    
    for (var i = startRow; i < data.length; i++) {
      var row = data[i];
      if (row[0] && row[0].toString().trim() !== '') {
        rsvps.push({
          name: row[0] || '',
          phone: row[1] || '',
          method: row[2] || 'Web Form',
          attendance: row[3] === 'Attending' ? 'yes' : 'no',
          transport: row[4] === 'Needs Transport' ? 'yes' : row[4] === 'Own Transport' ? 'no' : null,
          notes: row[5] || '',
          date: row[6] ? new Date(row[6]).toISOString() : new Date().toISOString()
        });
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      rsvps: rsvps
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString(),
      rsvps: []
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Setup function to create headers if needed
function setupSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Check if headers exist
  var headers = sheet.getRange(1, 1, 1, 7).getValues()[0];
  
  if (!headers[0] || headers[0] !== 'Name') {
    // Add headers
    sheet.getRange(1, 1, 1, 7).setValues([
      ['Name', 'Phone', 'Method', 'Attendance', 'Transport', 'Notes', 'Timestamp']
    ]);
    
    // Format headers
    sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
    sheet.getRange(1, 1, 1, 7).setBackground('#f3f4f6');
  }
}

// Instructions for deployment:
// 1. Go to your Google Sheet
// 2. Extensions > Apps Script
// 3. Replace the default code with this code
// 4. Save the project
// 5. Deploy > New deployment
// 6. Choose "Web app"
// 7. Set access to "Anyone"
// 8. Copy the Web App URL
// 9. Update the GOOGLE_SHEETS_URL in your config.js file 