const request = require('request');

function Nest(apiToken) {
    this.apiUrl = 'https://developer-api.nest.com';
    this.apiToken = apiToken;
    this.content = null;
}

/*
	options parameter is:
	{
		method: 'PUT', // optional, default is GET
		uri: '/devices', // optional, defaut is the root URI, to get the full object
		body: { target_temperature_c: 21.5 }, // optional
	}
*/
Nest.prototype.request = function(options) {
	var opts = options || {},
		that = this;

	var requestOpts = {
        method: opts.method || 'GET',
        url: this.apiUrl + (opts.uri || opts.url || ''),
		auth: {
			'bearer' : this.apiToken,
		},
		followAllRedirects: true,
		json: true
    };
    if(opts.body) {
    	requestOpts.body = opts.body;
    }

	return new Promise(function(resolve, reject) {
        request(requestOpts, function (error, response, body) {
               if (!error && response.statusCode == 200) {
                    that.content = body;
                    resolve(that.content); // once connected return the content
                }
                else {
                    console.error(error);
                    console.error(response.statusCode);
                    console.error(body);
                    reject(body);
                }
            }
        );
    });
};

Nest.prototype.getAll = function() {
	return this.request();
};

Nest.prototype.getLastApiResult = function() {
	if(this.content)
	{
		return Promise.resolve(this.content);
	}
	else
	{
		return this.getAll();
	}
}

Nest.prototype.getAllThermostatsTemperature = function() {
	return this.request({uri: '/devices/thermostats'})
		.then(function(data) {
			var temperature = [];
			Object.keys(data).forEach(function(uid)
			{
				var currentThermostat = data[uid];
				temperature.push({ "name" : currentThermostat.name, "temperature" : currentThermostat.ambient_temperature_c});
			});
			return temperature;
		});
}

Nest.prototype.getStatus = function() {
	return this.request({uri: '/devices/thermostats'})
		.then(function(data) {
			var temperature = [];
			Object.keys(data).forEach(function(uid)
			{
				var currentThermostat = data[uid];
				temperature.push({
					"name" : currentThermostat.name,
					"temperature" : currentThermostat.ambient_temperature_c,
					"target" : currentThermostat.target_temperature_c,
					"humidity":currentThermostat.humidity,
					"timestamp" : Math.floor(Date.parse(currentThermostat.last_connection) / 1000)
				});
			});
			return temperature;
		});
}

module.exports = exports = Nest;
