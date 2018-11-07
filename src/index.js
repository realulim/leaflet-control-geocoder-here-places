var L = require('leaflet'),
    HerePlaces = require('./geocoders/hereplaces');

module.exports = HerePlaces.class;

L.Util.extend(L.Control.Geocoder, {
	HEREPLACES: module.exports
});
