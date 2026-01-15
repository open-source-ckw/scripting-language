function sendSimpleEmail() {
  var recipient = "recipient@example.com"; // Replace with the recipient's email address
  var subject = "Hello from Google Apps Script";
  var body = "This email was sent using Google Apps Script's MailApp service.";
  
  MailApp.sendEmail(recipient, subject, body);
}

function sendAdvancedEmail() {
  var recipient = "recipient@example.com";
  var subject = "Advanced Email with Options";
  var body = "This is the plain text body. Your email client will use the HTML body if it supports it.";
  
  var options = {
    htmlBody: "<b>This</b> is the HTML body with a <i>bold</i> and <u>underlined</u> text.",
    cc: "cc@example.com",
    attachments: [DriveApp.getFileById('FILE_ID')] // Replace 'FILE_ID' with an actual Google Drive file ID
  };
  
  MailApp.sendEmail(recipient, subject, body, options);
}
