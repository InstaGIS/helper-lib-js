(function (window, undefined) {
    if (typeof window.google === "object" && typeof window.google.maps !== "undefined") {
        console.log('gmaps already present');
        window.gmaps = window.google.maps;
    } else {

        window.gmaps = {
            OverlayView: function () {},
            Marker: function () {},
            InfoWindow: function () {},
            LatLng: function (lat, lng) {
                return [lat, lng];
            },
            MVCObject: function (obj) {

            },
            Map: function (obj) {

            },
            MapTypeId: {
                ROADMAP: true
            },
            Data: {
                Feature: function () {

                }
            },
            places: {
                AutocompleteService: function () {

                },
                PlacesService: function (obj) {
                    return {
                        PlacesServiceStatus: {
                            OK: true
                        },
                        textSearch: function (query) {
                            return [];
                        },
                        nearbySearch: function (query) {
                            return [];
                        }
                    };
                }
            }

        };

    }

    window.gmapPromise = new Promise(function (resolve, reject) {
        window.__google_maps_callback__ = function () {

            if (window.google.maps) {
                window.gmaps = window.google.maps;
                console.log('google maps loaded');
                resolve(window.gmaps);
            } else {
                reject(new Error('no gmaps object!'));
            }

        };
    });

    return window.gmapPromise;

})(window);
