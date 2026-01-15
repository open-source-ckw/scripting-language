/*
Handle credentials securely in Google Apps Script.

1. Storing Credentials via the User Interface (Recommended) 
This is the most secure method as the secrets are never even present in the script's code history. 
- In your Apps Script project, go to the Project settings (the gear icon on the left navigation bar).
- Scroll down to Script properties.
- Click Add script property.
- Enter a key (e.g., MY_API_KEY) and a value (your secret token).
- Click Save. 
*/

// 2. Storing Credentials Programmatically
function setCredentials() {
  var scriptProperties = PropertiesService.getScriptProperties();
  
  // Set individual properties
  scriptProperties.setProperty('API_KEY', 'your_actual_api_key_here');
  scriptProperties.setProperty('SECRET_TOKEN', 'your_secret_token_here');
  
  // Set multiple properties at once
  var props = {
    'USERNAME': 'myuser',
    'PASSWORD': 'mypassword'
  };
  scriptProperties.setProperties(props);
  
  Logger.log('Credentials set successfully.');
}


// Accessing Stored Credentials in Your Script
function callExternalApi() {
  var scriptProperties = PropertiesService.getScriptProperties();
  
  // Get individual properties
  var apiKey = scriptProperties.getProperty('API_KEY');
  var secretToken = scriptProperties.getProperty('SECRET_TOKEN');
  
  // Check if the keys were found
  if (!apiKey || !secretToken) {
    Logger.log('Error: API keys are missing from Script Properties.');
    return;
  }
  
  // Use the credentials in your script (e.g., in a fetch call)
  /*
  var options = {
    'method' : 'get',
    'headers': {
      'Authorization': 'Bearer ' + secretToken,
      'X-API-Key': apiKey
    }
  };
  UrlFetchApp.fetch('https://api.example.com/data', options);
  */
}
