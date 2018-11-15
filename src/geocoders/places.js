import L from 'leaflet';
import {getJSON} from '../util';

module.exports = {
    class: L.Class.extend({
        options: {
            basePath: 'https://places.cit.api.here.com/places/v1/',
            suggestEndpoint: 'autosuggest',
            searchEndpoint: 'discover/search',
            geocodingQueryParams: {},
            reverseQueryParams: {}
        },

        initialize: function (options) {
            L.Util.setOptions(this, options);
        },

        geocode: function (query, cb, context) {
            let params = {
                q: query,
                app_id: this.options.app_id,
                app_code: this.options.app_code,
            };
            params = L.Util.extend(params, this.options.geocodingQueryParams);

            callGetJson(params, cb, context, this.options);
        },

        reverse: function (location, scale, cb, context) {
            let query = `${encodeURIComponent(location.lat)},${encodeURIComponent(location.lng)}`;
            let params = {
                q: query,
                at: query,
                tf: 'html',
                app_id: this.options.app_id,
                app_code: this.options.app_code,
            };
            params = L.Util.extend(params, this.options.reverseQueryParams);

            callGetJson(params, cb, context, this.options);
        },

        suggest: function (query, cb, context) {
            let params = {
                q: query,
                app_id: this.options.app_id,
                app_code: this.options.app_code,
                result_types: 'place, address'
            };
            params = L.Util.extend(params, this.options.geocodingQueryParams);

            getJSON(this.options.basePath + this.options.suggestEndpoint, params,
                data => {
                    cb.call(context,
                        data.results.map(result => ({
                            name: `${result.title}, ${result.vicinity || ''}`,
                            html: `${result.highlightedTitle}, ${result.highlightedVicinity}`,
                            bbox: convertHereBoundingBoxToLatLngBounds(result),
                            center: L.latLng(result.position),
                            href: result.href
                        }))
                    );
                }
            );
        }
    }),

    factory: function (options) {
        return new L.Control.Geocoder.HEREPLACES(options);
    }
};

const convertHereBoundingBoxToLatLngBounds = result => {
    if (result.hasOwnProperty('bbox')) {
        return L.latLngBounds(
            L.latLng(result.bbox[1], result.bbox[0]),
            L.latLng(result.bbox[3], result.bbox[2])
        );
    } else {
        return L.latLngBounds(L.latLng(result.position), L.latLng(result.position));
    }
};

const callGetJson = (params, cb, context, options) => {
    getJSON(options.basePath + options.searchEndpoint, params,
        data => {
            cb.call(context,
                data.results.items.map(item => ({
                    name: `${item.title}, ${item.vicinity || ''}`,
                    bbox: convertHereBoundingBoxToLatLngBounds(item),
                    center: L.latLng(item.position),
                    href: item.href
                }))
            );
        });
};