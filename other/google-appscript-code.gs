function LedgerSearch() {
  var temp;
  // Set spreadsheet unique id to process 
  const spreadsheetId = 'YOUR-Spread-Sheet-ID';

  // Set spreadsheet internal sheet name
  const tabA = 'Transaction';
  const tabB = 'LedgerSearch';
  const tabC = 'LedgerSummary';

  // Set message when search is performed without any parameters
  const msgEnterFilter    = 'Please enter filter data to perform search.';

  // Set all filter cell range address for ledger search
  const filterByLedger    = tabB+'!A4';
  const filterByFDate     = tabB+'!A7';
  const filterByTDate     = tabB+'!A10';
  const filterByFTime     = tabB+'!A13';
  const filterByTTime     = tabB+'!A16';
  const filterByFAmt      = tabB+'!A19';
  const filterByTAmt      = tabB+'!A22';
  const filterByBranch    = tabB+'!A25';
  const filterByRefNo     = tabB+'!A28';
  const filterByID        = tabB+'!A31';

  // Get all filter set value in variable to process
  var fVByLedger  = SpreadsheetApp.getActiveSheet().getRange(filterByLedger).getValue();
  var fVByFDate   = SpreadsheetApp.getActiveSheet().getRange(filterByFDate).getValue();
  var fVByTDate   = SpreadsheetApp.getActiveSheet().getRange(filterByTDate).getValue();
  var fVByFTime   = SpreadsheetApp.getActiveSheet().getRange(filterByFTime).getValue();
  var fVByTTime   = SpreadsheetApp.getActiveSheet().getRange(filterByTTime).getValue();
  var fVByFAmt    = SpreadsheetApp.getActiveSheet().getRange(filterByFAmt).getValue();
  var fVByTAmt    = SpreadsheetApp.getActiveSheet().getRange(filterByTAmt).getValue();
  var fVByBranch  = SpreadsheetApp.getActiveSheet().getRange(filterByBranch).getValue();
  var fVByRefNo   = SpreadsheetApp.getActiveSheet().getRange(filterByRefNo).getValue();
  var fVByID      = SpreadsheetApp.getActiveSheet().getRange(filterByID).getValue();
  
  // Show filter data
  //SpreadsheetApp.getUi().alert(fVByLedger+' | '+fVByFDate+' | '+fVByTDate+' | '+fVByFTime+' | '+fVByTTime+' | '+fVByFAmt+' | '+fVByTAmt+' | '+fVByBranch+' | '+fVByID+' | '+fVByRefNo); return;

  // Set filter summary cell range address
  const ssLedger      = tabB+'!B4';
  const ssTCR         = tabB+'!B7';
  const ssTDR         = tabB+'!B10';
  const ssBalance     = tabB+'!B13';

 // Set default value to summary value within search criteria
  var ssvBalance     = 0;
  var ssvTCR         = 0;
  var ssvTDR         = 0;

  // Set source and target sheet range address to get and set data
  const sourceRange= tabA+'!A2:I';
  const targetRange= tabB+'!C3:K';

 // Set entire internal sheet object in variable to process
  const spreadsheet = SpreadsheetApp.getActive();
  var sourceSheet = spreadsheet.getSheetByName(tabA);
  var targetSheet = spreadsheet.getSheetByName(tabB);

  try{

    // #################################################################
    // Clear sheet as we need to feed new data
    
    // Clear search results treansactions
    targetSheet.getRange(targetRange).clearContent();

    // reset ledger name
    targetSheet.getRange(ssLedger).setValue('');

    // set ledger balance
    targetSheet.getRange(ssBalance).setValue(0);

    // set ledger total cr
    targetSheet.getRange(ssTCR).setValue(0);

    // set ledger total dr
    targetSheet.getRange(ssTDR).setValue(0);

    // #################################################################

    // Reset condition as no filter found
    if (!fVByLedger && !fVByFDate && !fVByTDate && !fVByFTime && !fVByTTime && !fVByFAmt && !fVByTAmt && !fVByBranch && !fVByRefNo && !fVByID) {
      SpreadsheetApp.getUi().alert(msgEnterFilter);
      //Logger.log(msgEnterFilter);
      return;
    }

    // Format required data as needed for ledger name
    fVByLedger  = fVByLedger.toUpperCase();

    // If search is performed with date then reformate date 
    if(fVByFDate != ''){
      fVByFDate     = Utilities.formatDate(new Date(fVByFDate), "GMT+05:30", "dd-MMM-yyyy");
    }
    if(fVByTDate != ''){
      fVByTDate     = Utilities.formatDate(new Date(fVByTDate), "GMT+05:30", "dd-MMM-yyyy");
    }

    // If search is performed with time then reformate time 
    if(fVByFTime != ''){
      fVByFTime     = Utilities.formatDate(fVByFTime, "GMT+05:22", "HH:mm");
      // added hack GMT+05:22 not perfect solution temp as no solution found of net and to save time fixed as it is
    }
    if(fVByTTime != ''){
      fVByTTime     = Utilities.formatDate(fVByTTime, "GMT+05:22", "HH:mm");
    }

    // Show filter data
    //SpreadsheetApp.getUi().alert(fVByLedger+' | '+fVByFDate+' | '+fVByTDate+' | '+fVByFTime+' | '+fVByTTime+' | '+fVByFAmt+' | '+fVByTAmt+' | '+fVByBranch+' | '+fVByID+' | '+fVByRefNo); return;

    targetValues = sourceSheet.getRange(sourceRange).getValues().filter(function(r){
      /*
      Columns number list
      r[0] = ID
      r[1] = BRANCH
      r[2] = DATE
      r[3] = TIME
      r[4] = FROM-LEDGER
      r[5] = TO-LEDGER
      r[6] = AMOUNT
      r[7] = REF. NO
      r[8] = NOTE
      */
      
      // If search result has date then reformate date 
      if(r[2] != ''){
        r[2]  = Utilities.formatDate(new Date(r[2]), "GMT+05:30", "dd-MMM-yyyy");
      }
          
      // If search result has time then reformate date 
      if(r[3] != ''){
        r[3]  = Utilities.formatDate(r[3], "GMT+05:22", "HH:mm");
      }

      // Change ledger name to upper case
      r[4]  = r[4].toUpperCase();
      r[5]  = r[5].toUpperCase();

      // Algorithm to check data to find relavent match
      if(
          // match transaction id 
          (fVByID != '' && fVByID == r[0]) 
          ||
          (
            // make sure that transaction is not entered in filter
            (fVByID == '') &&
            // match ledger name
            (fVByLedger == '' || (fVByLedger == r[4] || fVByLedger == r[5])) &&
            // match date of transaction from
            (fVByFDate == '' || (fVByFDate != '' && (r[2] == fVByFDate || (fVByTDate != '' && r[2] > fVByFDate)))) &&
            // match date of transaction to
            (fVByTDate == '' || (fVByFDate != '' && fVByTDate != '' && r[2] <= fVByTDate)) &&
            // match time of transaction from
            (fVByFTime == '' || (fVByFTime != '' && (r[3] == fVByFTime || (fVByTTime != '' && r[3] > fVByFTime)))) &&
            // match time of transaction to
            (fVByTTime == '' || (fVByFTime != '' && fVByTTime != '' && r[3] <= fVByTTime)) &&
            // match amount of transaction from
            (fVByFAmt == '' || (fVByFAmt != '' && (r[6] == fVByFAmt || (fVByTAmt != '' && r[6] > fVByFAmt)))) &&
            // match amount of transaction to
            (fVByTAmt == '' || (fVByFAmt != '' && fVByTAmt != '' && r[6] <= fVByTAmt)) &&
            // match baranch name
            (fVByBranch == '' || (fVByBranch == r[1])) &&
            // match ref. no
            (fVByRefNo == '' || (fVByRefNo == r[7]))
          )
        )  
      { 
        // If filter is performed for ledger then need to calculate cr and dr amount
        if(fVByLedger != '')
        {
          if(fVByLedger == r[4]){
            ssvTDR += r[6];
          }
          else if(fVByLedger == r[5]){
            ssvTCR += r[6];
          }
        } 

          return true; // As search criteria matches with record return true to shortlist record
      }
      else{
          return false; // As search filter do not match with search criteria so discard from shortlist
      }
    });
      
    Logger.log(targetValues);
    if(targetValues.length > 0){
      targetSheet.getRange(3, 3, targetValues.length, targetValues[0].length).setValues(targetValues);
    }

    // If filter is performed for ledger then need to fill up summary
    if(fVByLedger != '')
    {
      // set Ledger balance
      ssvBalance = ssvTCR - ssvTDR;

      // set ledger name
      targetSheet.getRange(ssLedger).setValue(fVByLedger);

      // set ledger balance
      targetSheet.getRange(ssBalance).setValue(ssvBalance);

      // set ledger total cr
      targetSheet.getRange(ssTCR).setValue(ssvTCR);

      // set ledger total dr
      targetSheet.getRange(ssTDR).setValue(ssvTDR);
    }
  }
  catch (e) {
    // TODO (developer) - Handle Values.get() exception from Sheet API
    SpreadsheetApp.getUi().alert(e.message);
    Logger.log(e.message);
  }
}
