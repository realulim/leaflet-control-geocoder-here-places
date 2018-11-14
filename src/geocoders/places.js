import L from 'leaflet';
import {getJSON} from '../util';

module.exports = {
    class: L.Class.extend({
        options: {
            basePath: 'https://places.cit.api.here.com/places/v1/',
            suggest: 'autosuggest',
            reverse: 'discover/search',
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
                result_types: 'place, address'
            };
            params = L.Util.extend(params, this.options.geocodingQueryParams);

            getJSON(this.options.basePath + this.options.suggest, params,
                data => {
                    let results = [], latLngBounds;
                    for (let result of data.results) {
                        latLngBounds = convertBboxToLatLngBounds(result);
                        results.push({
                            name: `${result.title}, ${result.highlightedVicinity}`,
                            bbox: latLngBounds,
                            center: L.latLng(result.position),
                            href: result.href
                        });
                    }
                    cb.call(context, results)
                }
                // data => loadAdresses(data.results, cb, context)
            );
        },

        reverse: function (location, scale, cb, context) {
            console.log(`reverse: ${location}`);
            let query = `${encodeURIComponent(location.lat)},${encodeURIComponent(location.lng)}`;
            let params = {
                q: query,
                at: query,
                app_id: this.options.app_id,
                app_code: this.options.app_code,
            };
            params = L.Util.extend(params, this.options.reverseQueryParams);

            getJSON(this.options.basePath + this.options.reverse, params,
                data => {
                    let results = [], latLngBounds;
                    for (let item of data.results.items) {
                        latLngBounds = convertBboxToLatLngBounds(item);
                        results.push({
                            name: item.title,
                            bbox: latLngBounds,
                            center: L.latLng(item.position)
                        });
                    }
                    cb.call(context, results);
                });
        },

        suggest: function (query, cb, context) {
            return this.geocode(query, cb, context);
        }
    }),

    factory: function (options) {
        return new L.Control.Geocoder.HerePlaces(options);
    }
};

let loadAdresses = (results, cb, context) => {
    console.log(results);
    let addressResults = [];
    for (let result of results) {
        if (result.hasOwnProperty('href')) {
            load(result.href, function (addressResult) {
                var name = addressResult.location.address ? `${addressResult.name}, ${(addressResult.location.address.country) || ''}` : addressResult.title;
                addressResults.push({
                    name: name,
                    bbox: convertBboxToLatLngBounds(addressResult),
                    center: L.latLng(addressResult.position)
                })
            });
            cb.call(context, addressResults);
        }
    }
};

let load = (href, callback) => {
    var xmlHttp = new XMLHttpRequest();
    // xmlHttp.onreadystatechange = function () {
    //     if (xmlHttp.readyState !== 4) {
    //         return;
    //     }
    //     if (xmlHttp.status !== 200 && xmlHttp.status !== 304) {
    //         callback('');
    //         return;
    //     }
    //     callback(JSON.parse(xmlHttp.response));
    // };

    xmlHttp.open('GET', href, false);
    xmlHttp.setRequestHeader('Accept', 'application/json');
    xmlHttp.send(null);
    if (xmlHttp.status === 200) {
        callback(JSON.parse(xmlHttp.response));
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