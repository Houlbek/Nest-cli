# node-nest-cloud-api


[![npm package](https://nodei.co/npm/nest-cloud-api.png?downloads=true&stars=true)](https://nodei.co/npm/nest-cloud-api/)

A simple way to interface with Nest devices using official Rest API.


# Installation

Install and add it to your package.json with:

```bash
$ npm install nest-cloud-api --save
```

# Usage

```javascript
var Nest = require('nest-cloud-api');

var apiAccessToken = 'foobar'; // this is the Nest API access_token. To get it you can use https://github.com/denouche/node-nest-oauth2
var myNest = new Nest(apiAccessToken);

myNest.request()
    .then(function(data) {
   		console.info(data);
    });

myNest.request({ method: 'PUT', uri: '/devices/thermostats/<thermostatId>', body: { target_temperature_c: 21.5 }})
    .then(function(data) {
   		console.info('success!');
    });

```
