'use strict';

var request = require('request');
var bodyParser = require('body-parser');

exports.get_latitude_longitude = function (req, res) {

    var addressReq = req.body.address;
    var url =  'https://maps.googleapis.com/maps/api/geocode/json?&address='
                + encodeURIComponent(addressReq)
                +'&key=AIzaSyAFbHBKFi2jgpifwJcilAgDE99QBofYGGA';

    request({
                headers : {'Content-Type' : 'application/json'},  
                uri : url,
                method : 'GET'
            },
            function (err, response, body){
                
                if(err){
                    return console.log(err);
                }
                var parsedJSON = JSON.parse(response.body.replace(/\r?\n|\r/g, ''));
                
                res.json(parsedJSON.results[0].geometry.location);
            }
    );
};

exports.get_top_fifty_nearly_address = function (req, res) {

    
};

exports.get_complete_address = function (req, res) {
    Message.find({}, function (err, msg) {
        if (err)
            res.send(err);
        res.json(msg);
    });
};