[![NPM version](https://img.shields.io/npm/v/leaflet-control-geocoder-here-places.svg)](https://www.npmjs.com/package/leaflet-control-geocoder-here-places) ![Leaflet 1.0.0 compatible!](https://img.shields.io/badge/Leaflet%201.0.0-%E2%9C%93-1EB300.svg?style=flat) ![Leaflet Control Geocoder compatible!](https://img.shields.io/badge/Leaflet%20Control%20Geocoder%201.6.0-%E2%9C%93-1EB300.svg?style=flat)

## Leaflet geocoder with support for HERE places API
This is a plugin for Per Liedmann's Leaflet.Control.Geocoder using the HERE Places (Search) API as a basis for geocoding requests.

## Install
`npm install leaflet-control-geocoder-here-places`

## Build
`npm install`

`npm run dist`

## Usage
[Download Leaflet.Control.Geocoder](https://github.com/perliedman/leaflet-control-geocoder/releases) or obtain the latest release via cdn or package manager:
```
<link rel="stylesheet" href="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css" />

<script src="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js"></script>
<script src="../dist/Control.Geocoder.HerePlaces.js"></script>
```
Add the control to a map instance:
```
let map = L.map('map').setView([52.531,13.3848], 14),
    geocoder = L.Control.Geocoder.hereplaces({
              app_id: '<your app_id>',
              app_code: '<your app_code>',
              geocodingQueryParams: {
                at: 52.531,13.3848
              }
    }),
    control = L.Control.geocoder({
        geocoder: geocoder
    }).addTo(map),
    marker;

new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    minZoom: 2,
    maxZoom: 17,
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
 ```

## Demo
Demo available [here](/demo/index.html) (load file locally in your browser after installation)

## HERE Places API Documentations

[Places (Search) API Documentation](https://developer.here.com/documentation/places/topics/quick-start-find-text-string.html)

[HERE Places API](https://places.cit.api.here.com/places) 

### All the credit goes to Per
Per's repository is here:
https://github.com/perliedman/leaflet-control-geocoder
