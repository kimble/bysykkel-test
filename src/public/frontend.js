"use strict";

const interval = 20/*sek*/ * 1000;


/**
 * Har hatt dette patternet i bakhodet en stund med tanke på situasjoner hvor jeg ikke
 * har lyst til å dra inn react, redux med venner, men fortatt har lyst til å se hvordan
 * state blir mutert.
 */
const createApplicationState = (subscribers) => {
    const sortFunction = (s1, s2) => s1.title < s2.title ? -1 : s1.title > s2.title ? 1 : s1.title >= s2.title ? 0 : NaN;

    let state = {
        stations: [],
        loading: false,
        error: false
    };

    const mutate = (update) => {
        state = Object.assign(state, update);
        subscribers.forEach(s => s(state));
    };

    // Alle måtene state kan bli mutert på
    return {
        loadingData: () => {
            mutate({
                loading: true
            });
        },

        dataLoaded: (stations) => {
            mutate({
                stations: stations.sort(sortFunction),
                loading: false,
                error: false
            });
        },

        loadingFailed: (error) => {
            mutate({
               loading: false,
               error: error
            });
        }
    }
};

const createSpinnerUpdater = () => {
    const body = d3.select("body");

    return (state) => {
        body.classed("loading", state.loading === true);
    }
};

const createErrorUpdater = () => {
    const body = d3.select("body");
    const errorMessage = d3.select("#errorContainer").select(".message");

    return (state) => {
        body.classed("error", state.error !== false);
        errorMessage.html(state.error);
    };
};

const createStationUpdater = () => {
    const stationsContainer = d3.select("#stations");

    return (state) => {
        if (state.stations === null) {
            return;
        }

        const stationsSelection = stationsContainer.selectAll(".station");
        const selection = stationsSelection.data(state.stations, (d) => d.id);
        const enterStation = selection.enter().append("div").attr("id", (d) => "s_" + d.id).attr("class", "station");

        const appendHeader = enterStation.append("h2");
        appendHeader.append("span").attr("class", "title").text(d => d.title);
        appendHeader.append("br");
        appendHeader.append("small").attr("class", "subtitle").text(d => d.subtitle);
        const appendAvailability = enterStation.append("div").attr("class", "availability");
        appendAvailability.append("span").attr("class", "closed-sign").text("CLOSED");
        appendAvailability.append("span").attr("class", "message");

        // Enter + update

        const merge = enterStation.merge(selection);

        merge.classed("closed", (d) => d.closed);
        merge.classed("open", (d) => !d.closed);
        merge.select('.availability .message').html((d) => `Sykler: ${d.availability.bikes} av ${d.number_of_locks}`);
    }
};

const createMapUpdater = (ol) => {
    const mapLayer = new ol.layer.Tile({
        source: new ol.source.OSM()
    });

    const vectorSource = new ol.source.Vector({});

    const vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });

    const red = new ol.style.Style({
        image: new ol.style.Icon(({
            src: '/assets/marker_red.png'
        }))
    });

    const green = new ol.style.Style({
        image: new ol.style.Icon(({
            src: '/assets/marker_green.png'
        }))
    });

    new ol.Map({
        layers: [
            mapLayer,
            vectorLayer
        ],
        target: 'map',
        view: new ol.View({
            center: ol.proj.fromLonLat([10.769118, 59.93362]),
            zoom: 13
        })
    });

    const markers = {};

    const addMarker = (station) => {
        const marker = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([ station.position.longitude, station.position.latitude ]))
        });

        vectorSource.addFeature(marker);
        markers[station.id] = marker;
    };

    const updateMarker = (station) => {
        const marker = markers[station.id];

        if (station.availability.bikes > 0) {
            marker.setStyle(green);
        }
        else {
            marker.setStyle(red);
        }
    };


    return (s) => {
        for (const station of s.stations) {
            if (!markers[station.id]) {
                addMarker(station);
            }

            updateMarker(station);
        }
    };
};


const startApplication = (d3, ol) => {

    // Alt som er interessert i endringer i tilstand
    const appState = createApplicationState([
        createSpinnerUpdater(),
        createErrorUpdater(),
        createStationUpdater(),
        createMapUpdater(ol)
    ]);

    const fetchDataFromBackend = () => fetch('/proxy').then(r => r.json());

    const fetchAndReschedule = () => {
        const reschedule = () => setTimeout(fetchAndReschedule, interval);

        appState.loadingData();
        fetchDataFromBackend()
            .then((data) => {
                appState.dataLoaded(data);
                reschedule();
            })
            .catch((err) => {
                appState.loadingFailed("Lasting av data feilet..");
                console.error(err);
                reschedule();
            });
    };


    // Sparker i gang ballen
    fetchAndReschedule();

};


if (typeof module !== 'undefined' && module.exports) {
    module.exports.createAppState = createApplicationState;
}