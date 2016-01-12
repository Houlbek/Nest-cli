const request = require('request');
const moment = require('moment');

function Nest(apiToken) {
    this.apiUrl = 'https://developer-api.nest.com/devices';
    this.apiToken = apiToken;
    this.content = null;
}


Nest.prototype.refresh = function() {
    var that = this;
    return new Promise(function(resolve, reject) {
        var apiUrl = that.apiUrl;
        request(
            {
                method: 'GET',
                url: apiUrl,
				auth: {
					'bearer' : that.apiToken,
				},
				json: true
            }
            , function (error, response, body) {
               if (!error && response.statusCode == 200) {
                    that.content = body;
                    resolve(that.content); // once connected return the content
                }
                else {
                    console.error('Error while trying to get access_token from code');
                    console.error(error);
                    console.error(response.statusCode);
                    console.error(body);
                    reject(body);
                }
            }
        );
    });
};

Nest.prototype.getLastApiResult = function() {
	if(this.content)
	{
		return Promise.resolve(this.content);
	}
	else
	{
		return this.refresh();
	}
}

Nest.prototype.getAllTemperature = function() {
	return this.refresh()
		.then(function(data) {
			var temperature = [];
			var thermostatList = data.thermostats;
			Object.keys(thermostatList).forEach(function(uid)
			{
				var currentThermostat=thermostatList[uid];
				temperature.push({ "name" : currentThermostat.name, "temperature" : currentThermostat.ambient_temperature_c});
			});
			return temperature;
		});
}

Nest.prototype.getStatus = function() {
	return this.refresh()
		.then(function(data) {
			var temperature = [];
			var thermostatList = data.thermostats;
			Object.keys(thermostatList).forEach(function(uid)
			{
				var currentThermostat=thermostatList[uid];
				temperature.push({ "name" : currentThermostat.name, "temperature" : currentThermostat.ambient_temperature_c,"target" : currentThermostat.target_temperature_c,"humidity":currentThermostat.humidity, "timestamp" : moment(currentThermostat.last_connection).unix()});
			});
			return temperature;
		});
}

module.exports = exports = Nest;
