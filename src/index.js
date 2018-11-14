// var L = require('leaflet'),
// HerePlaces = require('./geocoders/places');
import L from 'leaflet' ;
import HerePlaces from './geocoders/places'

module.exports = HerePlaces.class;

L.Util.extend(L.Control.Geocoder, {
	HerePlaces: module.exports,
	herePlaces: HerePlaces.factory
});
