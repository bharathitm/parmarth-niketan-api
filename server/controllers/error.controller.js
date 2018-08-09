var mysql = require('mysql');
var config = require('../mysqlconfig.js');
var connection = mysql.createConnection(config);


var error = {
    
LogError: function(message) {

   var call_stored_proc = "CALL sp_InsertErrorLog('" 
   + message + 
   "')";

   console.log(call_stored_proc + " server side error");

   connection.query(call_stored_proc, true, (error, results, fields) => {

   });
     
   //connection.end();   
}

};

module.exports = error;