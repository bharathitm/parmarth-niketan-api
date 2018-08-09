

var countries = require('../countries.js');


var Client = require('node-rest-client').Client;
var client = new Client();
var access_token = null;

var mysql = require('mysql');
var dbconfig = require('../mysqlconfig.js');
var connection = mysql.createConnection(dbconfig);
var errorController = require('./error.controller.js');

var config = require('../config/config');

var salesforce = {
    UpdateSalesforce: function(){
        var args = {
            headers: { "Content-Type": "application/json" }
        };
        
        client.post("https://ap4.salesforce.com/services/oauth2/token?grant_type=password&client_id=" 
        + config.sf_client_id + "&client_secret=" + config.sf_client_secret 
        + "&username=" + config.sf_user_name + "&password=" + config.sf_password, args, function (data) {
            access_token = data.access_token;
            fetchGuestsForSalesforce();
        });
    }
};

function fetchGuestsForSalesforce(){
    var call_stored_proc = "CALL sp_GetGuestsForSalesforce()";

    console.log(call_stored_proc);

    connection.query(call_stored_proc, true, (error, results) => {
    if (error) {
        errorController.LogError(error);
    }
        for (var i=0; i< results[0].length; i ++){
            try{

                if (results[0][i].sf_id == null){
                    insertGuestDetails(results[0][i].guest_id, results[0][i].first_name, results[0][i].last_name, 
                            results[0][i].email_id, results[0][i].phone_no, results[0][i].address, results[0][i].city, results[0][i].zip_code, 
                            results[0][i].state, results[0][i].country_id);
                    //insertGuestDetails();
                }
                else {
                    updateGuestDetails(results[0][i].sf_id, results[0][i].first_name, results[0][i].last_name, 
                        results[0][i].email_id, results[0][i].phone_no, results[0][i].address, results[0][i].city, results[0][i].zip_code, 
                        results[0][i].state, results[0][i].country_id);
                }

            } catch (error){
                errorController.LogError(error);
            }

          }
    });
   // connection.end();   
}

function insertGuestDetails(guest_id, first_name, last_name, email_id, phone_no, address, city, zip_code, state, country_id){
        var args = {
            data: {  
                    FirstName : first_name,
                    LastName : last_name,
                    MobilePhone : phone_no,
                    Email : email_id,
                    Street : address, 
                    City : city,
                    State : state,
                    PostalCode : zip_code,
                    Country : countries[country_id],
                    Company : "Parmarth Niketan"
                },
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + access_token }
        };
        
        client.post("https://ap4.my.salesforce.com/services/data/v21.0/sobjects/Lead", args, function (data) {

        var item = data;

            var call_stored_proc = "CALL sp_UpdateGuestSalesForceID('" 
            + guest_id + "','"
            + item.id + "')";

            connection.query(call_stored_proc, true, (error, results, fields) => {
            if (error) {
                errorController.LogError(error);
                return res.send(error.code);
            }
            });
        });
}

function updateGuestDetails(sf_id, first_name, last_name, email_id, phone_no, address, city, zip_code, state, country_id){
    var args = {
        data: {  
                FirstName : first_name,
                LastName : last_name,
                MobilePhone : phone_no,
                Email : email_id,
                Street : address, 
                City : city,
                State : state,
                PostalCode : zip_code,
                Country : countries[country_id],
                Company : "Parmarth Niketan"
            },
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + access_token }
    };
    
    client.patch("https://ap4.salesforce.com/services/data/v35.0/sobjects/Lead/" + sf_id, args, function (data) {
    });
}

module.exports = salesforce;
