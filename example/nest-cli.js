var Nest = require('../lib/nest');

var token = 'PLEASE INSERT TOKEN HERE https://github.com/denouche/node-nest-oauth2 if you need to retrieve it';

var url = 'https://developer-api.nest.com/devices';
var myNest = new Nest(url, token);

   myNest.refresh()
   .then(function(data) {
   	console.log(myNest.getStatus());
   }, function(error) {
   	console.error(error);
   });


