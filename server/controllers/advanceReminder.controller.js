var nodemailer = require('nodemailer');
var mysql = require('mysql');
var dbconfig = require('../mysqlconfig.js');
var connection = mysql.createConnection(dbconfig);
var errorController = require('./error.controller');

var config = require('../config/config');



var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.GMAIL_USER_NAME,
    pass: config.GMAIL_PASSWORD
  }
});

var htmlText =  '<br/>Greetings from Parmarth Niketan!<br/>This is to remind you about the advance donation for your upcoming reservation at the ashram.<br/><br/><b>Warm Regards,</b><br/>Parmarth Niketan';

var advance = {
      SendAdvanceReminders: function(isReminder) {

            var call_stored_proc = "CALL sp_GetAdvanceDonationReminders()";

              connection.query(call_stored_proc, true, (error, results, fields) => {

              if (error) {
                  errorController.LogError(error);
                  console.log(error.code);
              }

              console.log(results[0]);

              if (results[0] != '')
              {
                  for (var i=0; i< results[0].length; i ++){
                      try{

                        var mailOptions = {
                          from: process.env.GMAIL_USER,
                          to : JSON.stringify(results[0][i].email_id),
                          subject: 'Parmarth Niketan - Upcoming Reservation',
                          html: 'Dear ' + results[0][i].guest_name + ',' + htmlText
                        };
                  
                        transporter.sendMail(mailOptions, function(error, info){
                          if (error) {
                                errorController.LogError(error);
                                console.log(error);
                          } else {
                            console.log('Email sent: ' + info.response);
                          }
                        });
                      } catch (error){
                        errorController.LogError(error);
                        console.log(error);
                      }

                    }
              }
            
              });
            // connection.end();    
      }
};

module.exports = advance;