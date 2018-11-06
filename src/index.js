var L = require('leaflet'),
    Hereplaces = require('./geocoders/hereplaces');
// var L = {Control : {require('leaflet-control-geocoder');

module.exports = HerePlaces.class;

L.Util.extend(L.Control.Geocoder, {
	HerePlaces: module.exports,
	hereplaces: Hereplaces.factory
});
