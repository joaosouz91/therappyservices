'use strict';

var request = require('request');

const googleMapsClient = require('@google/maps').createClient({
    key : 'AIzaSyAFbHBKFi2jgpifwJcilAgDE99QBofYGGA'
});

exports.get_location = function (req, res) {

    var addressReq = req.params.address;

    request({
        headers: { 'Content-Type': 'application/json' },
        url: 'https://maps.googleapis.com/maps/api/geocode/json?&address='
            + encodeURIComponent(addressReq)
            + '&key=AIzaSyAFbHBKFi2jgpifwJcilAgDE99QBofYGGA',
        method: 'GET'
    },
        function (err, response, body) {

            if (err) {
                res.status(400);
                res.json({"erro" : "parametro incorreto" });
            }
            //parse
            var parsedJSON = JSON.parse(response.body.replace(/\r?\n|\r/g, ''));
            if(parsedJSON.status == "ZERO_RESULTS"){
                res.status(400);
                res.json({"erro" : "parametro incorreto" });
            }

            res.json(parsedJSON.results[0].geometry.location);
        }
    );
};

exports.get_distance = function (req, res) {

    //console.log(req.body.origin);
    var origin = req.body.origin;
    var destinations = req.body.destinations;
    var mode = req.body.mode;

    googleMapsClient.distanceMatrix({
            origins : origin,
            destinations : destinations,
            departure_time: 'now',
            mode: mode
        }, function(err, result){
            if(!err){
                /*
                var jsonObj2 = {};
                jsonObj2.teste = "c";
                jsonObj2["teste"][0] = {"teste" : "teste"}; //nao permitido
                console.log(jsonObj2);
                */
                var newJsonObj = {};
                newJsonObj.origin = origin;
                var distances = {};
                for(var i = 0; i < result.json.rows[0].elements.length; i++){
                    //Para que a linha 57 possa ser executada, necessario que "distance" ja esteja declardo como uma propriedade de "newJsonObject"
                    //newJsonObj["distance"][i] = result.json.rows[0].elements[i].distance.value+"m"; 
                    distances["destination_"+i] = result.json.rows[0].elements[i].distance.value+"m";            
                }
                newJsonObj["distances"] = distances;
                console.log(newJsonObj);
                res.json(newJsonObj);
            }else{
                res.error(err.message);
            }
        });
};

exports.get_complete_address = function (req, res) {

    if(req.params.cep.length < 8 || req.params.cep.length > 9){
        res.status(400);
        return res.json({"erro" : "parametro incorreto" });
    }

    var cep = req.params.cep;
    if(!cep.includes("-")){
        cep = cep.slice(0, 5) + "-" + cep.slice(5);
    }

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
                res.status(400);
                res.json({"erro" : "parametro incorreto" });
            }
            //parse
            var parsedJSON = JSON.parse(response.body.replace(/\r?\n|\r/g, ''));
            if(parsedJSON.status == "ZERO_RESULTS"){
                res.status(400);
                res.json({"erro" : "parametro incorreto" });
            }

            var latlng = "" + parsedJSON.results[0].geometry.location.lat + "," + parsedJSON.results[0].geometry.location.lng;
            //necessário fazer um 2º request passando latitude e longitude pois o response anterior não traz a rua
            request({
                headers: { 'Content-Type': 'application/json' },
                uri: 'https://maps.googleapis.com/maps/api/geocode/json?&latlng='
                    + encodeURIComponent(latlng)
                    + '&key=AIzaSyAFbHBKFi2jgpifwJcilAgDE99QBofYGGA',
                method: 'GET'
            },
                function (err, response, body) {
                    if (err) {
                        res.status(400);
                        res.json({"erro" : "parametro incorreto" });
                    }
                    //parse
                    var parsedJSON = JSON.parse(response.body.replace(/\r?\n|\r/g, ''));
                    if(parsedJSON.status == "ZERO_RESULTS"){
                        res.status(400);
                        res.json({"erro" : "parametro incorreto" });
                    }

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