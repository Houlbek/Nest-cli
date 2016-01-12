const request = require('request');
const moment = require('moment');

function Nest(apiUrl, apiToken) {
    this.apiUrl = apiUrl;
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
                headers: {
                    accept: 'application/json'
                }
            }
            , function (error, response, body) {
               if (!error && response.statusCode == 200) {
                    that.content = JSON.parse(body);
                    resolve(that.content); // once connected return the content
                }
                else {
                    console.error('Error while trying to get access_token from code');
                    console.error(error);
                    console.error(response.statusCode);
                    console.error(body);
                    if(body) {
                        try {
                            reject(JSON.parse(body));
                        }
                        catch(e) {
                            reject();
                        }
                    }
                    else {
                        reject();
                    }
                }
            }
        );
    });
};

Nest.prototype.getLastApiResult = function() {
	if(this.content)
	{
		return this.content;
	}
	else
	{
		this.refresh();
		if(this.content)
		{
			return this.content;
		}
		else {
			console.error('Cannot fetch the Api.');
			return null;
		}
	}
}

Nest.prototype.getAllTemperature = function() {
	this.refresh();
	var Temperature = [];
	var ThermostatList = this.content.thermostats;
	Object.keys(ThermostatList).forEach(function(uid)
	{
		var currentThermostat=ThermostatList[uid];
		Temperature.push({ "name" : currentThermostat.name, "temperature" : currentThermostat.ambient_temperature_c});
		
	});
	return Temperature;
}

Nest.prototype.getStatus = function() {
	this.refresh();
	var Temperature = [];
	var ThermostatList = this.content.thermostats;
	Object.keys(ThermostatList).forEach(function(uid)
	{
		var currentThermostat=ThermostatList[uid];
		Temperature.push({ "name" : currentThermostat.name, "temperature" : currentThermostat.ambient_temperature_c,"target" : currentThermostat.target_temperature_c,"humidity":currentThermostat.humidity, "timestamp" : moment(currentThermostat.last_connection).unix()});

		
	});
	return Temperature;
}

module.exports = exports = Nest;
