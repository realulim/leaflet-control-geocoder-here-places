var L = require('leaflet'),
	Util = require('../util');

module.exports = {
	class: L.Class.extend({
		options: {
		  geocodeUrl: 'http://geocoder.api.here.com/6.2/geocode.json',
		  reverseGeocodeUrl: 'http://reverse.geocoder.api.here.com/6.2/reversegeocode.json',
		  app_id: '<insert your app_id here>',
		  app_code: '<insert your app_code here>',
		  geocodingQueryParams: {},
		  reverseQueryParams: {}
		},

		initialize: function(options) {
			L.Util.setOptions(this, options);
		},

		geocode: function(query, cb, context) {
			var params = {
			  searchtext: query,
			  gen: 9,
			  app_id: this.options.app_id,
			  app_code: this.options.app_code,
			  jsonattributes: 1
			};
			params = L.Util.extend(params, this.options.geocodingQueryParams);
			Util.getJSON(this.options.geocodeUrl, params, cb, context);
		},

		suggest: function(query,cb,context) {
			// TODO perhaps use HERE autocompletion API
			return this.geocode(query, cb, context);
		},

		reverse: function(location, scale, cb, context) {
			var params = {
			  prox: encodeURIComponent(location.lat) + ',' + encodeURIComponent(location.lng),
			  mode: 'retrieveAddresses',
			  app_id: this.options.app_id,
			  app_code: this.options.app_code,
			  gen: 9,
			  jsonattributes: 1
			};
			params = L.Util.extend(params, this.options.reverseQueryParams);
			Util.getJSON(this.options.reverseGeocodeUrl, params, cb, context);
		}
	}),

	factory: function(options) {
		return new L.Control.Geocoder.HEREPLACES(options);
	}
};
