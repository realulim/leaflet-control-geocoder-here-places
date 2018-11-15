import L from 'leaflet';
import HerePlaces from './geocoders/places'

L.Util.extend(L.Control.Geocoder, {
    HEREPLACES: HerePlaces.class,
    hereplaces: HerePlaces.factory
});