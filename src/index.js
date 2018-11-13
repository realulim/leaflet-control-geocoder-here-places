var L = require('leaflet');
var HerePlaces = require('./geocoders/hereplaces');

L.Util.extend(L.Control.Geocoder, {
    HEREPLACES: HerePlaces.class,
    hereplaces: HEREPLACES.factory
});
