# Google Sheets Integration Guide for Byte Builder AI

Follow these simple steps to connect your Google Sheet to **Byte Builder AI** so all Login and Account Sign Up events automatically stream directly into your Google Sheet!

---

## Google Sheet Headers (Row 1)

In your Google Sheet **[Open Sheet](https://docs.google.com/spreadsheets/d/19QxxZDtWmZgxYP2S2a-gQPx_PwCIAoHggmh9C5uL6Lg/edit)**, make sure Row 1 has the following column headers:

| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H | Column I |
|---|---|---|---|---|---|---|---|---|
| `Timestamp` | `Action` | `Full Name` | `Email` | `Phone Number` | `Password` | `Target Role` | `Location` | `User Agent` |

---

## Google Apps Script Snippet

Update your Google Sheet Apps Script (**Extensions > Apps Script**) with this updated snippet:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Append Row: Timestamp | Action | Name | Email | Phone | Password | Role | Location | UserAgent
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString(),
      data.action || "N/A",
      data.name || "N/A",
      data.email || "N/A",
      data.phone || "N/A",
      data.password || "N/A",
      data.role || "N/A",
      data.location || "N/A",
      data.userAgent || "N/A"
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ result: "success" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", error: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## Test Script Payload

You can test by creating an account on [http://localhost:3000/signup](http://localhost:3000/signup) or logging in on [http://localhost:3000/login](http://localhost:3000/login). All fields (Name, Email, Phone, Password, Action, Timestamp) will stream to your sheet in real-time!
