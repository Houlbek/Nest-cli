var Nest = require('../lib/nest');

var token = 'PLEASE INSERT TOKEN HERE https://github.com/denouche/node-nest-oauth2 if you need to retrieve it';

var myNest = new Nest(token);

myNest.refresh()
    .then(function(data) {
   		console.log(data);
    }, function(error) {
	   	console.error(error);
    });

