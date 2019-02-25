'use strict';

var request = require('request');

exports.get_latitude_longitude = function (req, res) {

    var addressReq = req.body.address;

    request({
        headers: { 'Content-Type': 'application/json' },
        url: 'https://maps.googleapis.com/maps/api/geocode/json?&address='
            + encodeURIComponent(addressReq)
            + '&key=AIzaSyAFbHBKFi2jgpifwJcilAgDE99QBofYGGA',
        method: 'GET'
    },
        function (err, response, body) {

            if (err) {
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

    var cep = req.body.cep;

    //1o request: recuperar dados a partir do cep
    request({
        headers: { 'Content-Type': 'application/json' },
        uri: 'https://maps.googleapis.com/maps/api/geocode/json?&address='
            + encodeURIComponent(cep)
            + '&key=AIzaSyAFbHBKFi2jgpifwJcilAgDE99QBofYGGA',
        method: 'GET'
    },
        function (err, response, body) {
            if (err) {
                return console.log(err);
            }
            var parsedJSON = JSON.parse(response.body.replace(/\r?\n|\r/g, ''));
            var latlng = "" + parsedJSON.results[0].geometry.location.lat + "," + parsedJSON.results[0].geometry.location.lng;

            //necessário fazer um 2o request passando latitude e longitude pois o response anterior não traz a rua
            request({
                headers: { 'Content-Type': 'application/json' },
                uri: 'https://maps.googleapis.com/maps/api/geocode/json?&latlng='
                    + encodeURIComponent(latlng)
                    + '&key=AIzaSyAFbHBKFi2jgpifwJcilAgDE99QBofYGGA',
                method: 'GET'
            },
                function (err, response, body) {
                    if (err) {
                        return console.log(err);
                    }
                    var parsedJSON = JSON.parse(response.body.replace(/\r?\n|\r/g, ''));

                    var address = {
                        "district": parsedJSON.results[0].address_components[2].short_name,
                            "city": parsedJSON.results[0].address_components[3].short_name,
                           "state": parsedJSON.results[0].address_components[4].short_name,
                         "country": parsedJSON.results[0].address_components[5].long_name,
                          "street": parsedJSON.results[0].address_components[1].long_name,
                    }

                    res.send(address);
                }
            );
        }
    );
};