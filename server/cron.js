var cron= require('node-cron');
 
var advance = require('./controllers/advanceReminder.controller');
var salesforce = require('./controllers/salesforce.controller');

// cron service for advance donation reminders
cron.schedule('* * 21 * *', function(){
       advance.SendAdvanceReminders(true);
     });

// cron for updating salesforce account with guest details
cron.schedule('* * 23 * *', function(){
      salesforce.UpdateSalesforce();
     });
     