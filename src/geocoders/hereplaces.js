var L = require('leaflet');

module.exports = {
	"class": L.Class.extend({
		options: {
			geocodeUrl: 'http://geocoder.api.here.com/6.2/geocode.json',
			reverseGeocodeUrl: 'http://reverse.geocoder.api.here.com/6.2/reversegeocode.json',
			app_id: '<insert your app_id here>',
			app_code: '<insert your app_code here>',
			geocodingQueryParams: {},
			reverseQueryParams: {}
		},

		initialize: function (options) {
			L.Util.setOptions(this, options);
		},

		geocode: function (query, cb, context) {
			var params = {
				searchtext: query,
				gen: 9,
				app_id: this.options.app_id,
				app_code: this.options.app_code,
				jsonattributes: 1
			};
			params = L.Util.extend(params, this.options.geocodingQueryParams);
			this.getJSON(this.options.geocodeUrl, params, cb, context);
		},

		suggest: function (query, cb, context) {
			// TODO perhaps use HERE autocompletion API
			return this.geocode(query, cb, context);
		},

		reverse: function (location, scale, cb, context) {
			var params = {
				prox: encodeURIComponent(location.lat) + ',' + encodeURIComponent(location.lng),
				mode: 'retrieveAddresses',
				app_id: this.options.app_id,
				app_code: this.options.app_code,
				gen: 9,
				jsonattributes: 1
			};
			params = L.Util.extend(params, this.options.reverseQueryParams);
			this.getJSON(this.options.reverseGeocodeUrl, params, cb, context);
		},

		getParamString: function (obj, existingUrl, uppercase) {
			var params = [];
			for (var i in obj) {
				var key = encodeURIComponent(uppercase ? i.toUpperCase() : i);
				var value = obj[i];
				if (!L.Util.isArray(value)) {
					params.push(key + '=' + encodeURIComponent(value));
				} else {
					for (var j = 0; j < value.length; j++) {
						params.push(key + '=' + encodeURIComponent(value[j]));
					}
				}
			}
			return (!existingUrl || existingUrl.indexOf('?') === -1 ? '?' : '&') + params.join('&');
		},

		executeQuery: function (url, params, callback) {
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.onreadystatechange = function () {
				if (xmlHttp.readyState !== 4) {
					return;
				}
				if (xmlHttp.status !== 200 && xmlHttp.status !== 304) {
					callback('');
					return;
				}
				callback(JSON.parse(xmlHttp.response));
			};
			xmlHttp.open('GET', url + this.getParamString(params), true);
			xmlHttp.setRequestHeader('Accept', 'application/json');
			xmlHttp.send(null);
		},

		getJSON: function (url, params, cb, context) {
			this.executeQuery(url, params, function (data) {
				var results = [],
					loc,
					latLng,
					latLngBounds;
				if (data.response.view && data.response.view.length) {
					for (var i = 0; i <= data.response.view[0].result.length - 1; i++) {
						loc = data.response.view[0].result[i].location;
						latLng = L.latLng(loc.displayPosition.latitude, loc.displayPosition.longitude);
						latLngBounds = L.latLngBounds(
							L.latLng(loc.mapView.topLeft.latitude, loc.mapView.topLeft.longitude),
							L.latLng(loc.mapView.bottomRight.latitude, loc.mapView.bottomRight.longitude)
						);
						results[i] = {
							name: loc.address.label,
							bbox: latLngBounds,
							center: latLng
						};
					}
				}
				cb.call(context, results);
			});
		}

	}),

	factory: function (options) {
		return new L.Control.Geocoder.HEREPLACES(options);
	}

};
