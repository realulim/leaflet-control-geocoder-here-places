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
            console.log("geocode");
            let params = {
                q: query,
                tf: 'plain',
                app_id: this.options.app_id,
                app_code: this.options.app_code,
            };
            params = L.Util.extend(params, this.options.geocodingQueryParams);

            getJSON(this.options.basePath + this.options.searchEndpoint, params,
                data => {
                    let results = [], latLngBounds;
                    for (let item of data.results.items) {
                        latLngBounds = convertBboxToLatLngBounds(item);
                        results.push({
                            name: `${item.title}, ${item.vicinity || item.highlightedVicinity || ''}`,
                            bbox: latLngBounds,
                            center: L.latLng(item.position)
                        });
                    }
                    cb.call(context, results);
                });

        },

        reverse: function (location, scale, cb, context) {
            console.log("reverse");
            let query = `${encodeURIComponent(location.lat)},${encodeURIComponent(location.lng)}`;
            let params = {
                q: query,
                at: query,
                tf: 'plain',
                app_id: this.options.app_id,
                app_code: this.options.app_code,
            };
            params = L.Util.extend(params, this.options.reverseQueryParams);

            getJSON(this.options.basePath + this.options.searchEndpoint, params,
                data => {
                    let results = [], latLngBounds;
                    for (let item of data.results.items) {
                        latLngBounds = convertBboxToLatLngBounds(item);
                        results.push({
                            name: `${item.title}, ${item.vicinity || item.highlightedVicinity || ''}`,
                            bbox: latLngBounds,
                            center: L.latLng(item.position)
                        });
                    }
                    cb.call(context, results);
                });
        },

        suggest: function (query, cb, context) {
            console.log("suggest");
            let params = {
                q: query,
                tf: 'plain',
                pretty: true,
                app_id: this.options.app_id,
                app_code: this.options.app_code,
                result_types: 'place, address'
            };
            params = L.Util.extend(params, this.options.geocodingQueryParams);

            getJSON(this.options.basePath + this.options.suggestEndpoint, params,
                data => {
                    let results = [], latLngBounds;
                    for (let result of data.results) {
                        latLngBounds = convertBboxToLatLngBounds(result);
                        results.push({
                            name: `${result.title}, ${result.vicinity || ''}` || `${result.highlightedTitle}, ${result.highlightedVicinity}` || result.title,
                            bbox: latLngBounds,
                            center: L.latLng(result.position),
                            href: result.href
                        });
                    }
                    cb.call(context, results)
                }
            );
        }
    }),

    factory: function (options) {
        return new L.Control.Geocoder.HerePlaces(options);
    }
};

let convertBboxToLatLngBounds = result => {
    if (result.hasOwnProperty('bbox')) {
        return L.latLngBounds(
            L.latLng(result.bbox[1], result.bbox[0]),
            L.latLng(result.bbox[3], result.bbox[2])
        );
    } else {
        return L.latLngBounds(L.latLng(result.position), L.latLng(result.position));
    }
};