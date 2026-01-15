/**
 * The function you want to run daily.
 */
function dailyTask() {
  // Add the code you want to run every day here
  console.log("Daily task ran successfully!");
}

/**
 * Creates a time-based trigger for the dailyTask function.
 */
function createDailyTrigger() {
  // Check if a trigger already exists to prevent creating duplicates
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === "dailyTask") {
      console.log("Daily trigger already exists.");
      return; // Exit the function if a trigger is found
    }
  }

  // Create the new daily trigger
  ScriptApp.newTrigger('dailyTask')
    .timeBased()
    .everyDays(1) // Sets it to run every day
    // Optional: set a specific time window for the trigger
    .atHour(8) // Sets it to run at 8 AM (approximate)
    .nearMinute(30) // Sets it to run near 8:30 AM
    .create();

  console.log("Daily trigger created successfully.");
}

/**
 * Optional: A function to delete all triggers (useful for cleanup/reset).
 */
function deleteTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    ScriptApp.deleteTrigger(trigger);
  }
  console.log("All triggers deleted.");
}
