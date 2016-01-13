var Nest = require('../lib/nest');

var token = 'PLEASE INSERT TOKEN HERE https://github.com/denouche/node-nest-oauth2 if you need to retrieve it';

var myNest = new Nest(token);

myNest.request()
    .then(function(data) {
   		console.log(data);
    }, function(error) {
	   	console.error(error);
    });

myNest.request({ method: 'PUT', uri: '/devices/thermostats/<thermostatId>', body: { target_temperature_c: 21.5 }})
    .then(function(data) {
   		console.log(data);
    }, function(error) {
	   	console.error(error);
    });
