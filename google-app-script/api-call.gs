function callGuestyApi() {
  const CLIENT_ID = 'YOUR_CLIENT_ID'; // Replace with your Guesty Client ID
  const CLIENT_SECRET = 'YOUR_CLIENT_SECRET'; // Replace with your Guesty Client Secret
  
  // 1. Get the Access Token
  const tokenUrl = 'https://open-api.guesty.com/oauth2/token';
  const tokenPayload = {
    'clientId': CLIENT_ID,
    'clientSecret': CLIENT_SECRET
  };
  
  const tokenOptions = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(tokenPayload),
    'muteHttpExceptions': true // Allows script to continue if an error occurs and inspect the response
  };
  
  const tokenResponse = UrlFetchApp.fetch(tokenUrl, tokenOptions);
  const tokenData = JSON.parse(tokenResponse.getContentText());
  const accessToken = tokenData.access_token;
  
  if (!accessToken) {
    Logger.log("Failed to obtain access token: " + tokenResponse.getContentText());
    return;
  }
  
  // 2. Make a subsequent API call (e.g., fetch listings)
  const listingsUrl = 'https://open-api.guesty.com/v1/listings';
  const listingsOptions = {
    'method' : 'get',
    'headers': {
      'Authorization': 'Bearer ' + accessToken
    },
    'muteHttpExceptions': true
  };
  
  const listingsResponse = UrlFetchApp.fetch(listingsUrl, listingsOptions);
  const listingsData = JSON.parse(listingsResponse.getContentText());
  
  // Log the results or process the data
  Logger.log(listingsData);
  // Example: write to a Google Sheet
  // SpreadsheetApp.getActiveSheet().getRange('A1').setValue(JSON.stringify(listingsData));
}
