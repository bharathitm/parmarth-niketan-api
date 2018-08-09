var mysql = require('mysql');
var config = require('../mysqlconfig.js');
var connection = mysql.createConnection(config);
var errorController = require('./error.controller');
var path = require('path');

var express = require('express');
var router = express.Router();


// export function ValidateGuestEmail(req, res) {
router.get('/', function (req, res) {

    var call_stored_proc = "CALL sp_ValidateGuestEmailID('"    
    + req.query.token + "')"; 

    console.log(call_stored_proc);

    connection.query(call_stored_proc, true, (error, results, fields) => {
    // if (error) {
    //     //errorController.LogError(error);
    //     return res.send(error.code);
    // }
    });
    res.sendFile(path.join(__dirname, '../index.html'));
      
    //connection.end();   
});

module.exports = router