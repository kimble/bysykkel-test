"use strict";

const interval = 20/*sek*/ * 1000;


/**
 * Har hatt dette patternet i bakhodet en stund med tanke på situasjoner hvor jeg ikke
 * har lyst til å dra inn react, redux med venner, men fortatt har lyst til å se hvordan
 * state blir mutert.
 */
const createApplicationState = (subscribers) => {
    const sortFunction = (s1, s2) => d3.ascending(s1.title, s2.title);

    let state = {
        stations: [],
        loading: false,
        error: null
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
                error: null
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
        body.classed("error", state.error === null);
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
        const enterStation = selection.enter().append("div").attr("class", "station");

        const appendHeader = enterStation.append("h2");
        appendHeader.append("span").text(d => d.title);
        appendHeader.append("br");
        appendHeader.append("small").text(d => d.subtitle);
        enterStation.append("div").attr("class", "availability");

        // Enter + update

        const merge = enterStation.merge(selection);

        merge.classed("closed", (d) => d.closed);
        merge.select('.availability').html((d) => `${d.availability.bikes} av ${d.availability.locks} (${d.number_of_locks})`);
    }
};


const appState = createApplicationState([
    createSpinnerUpdater(),
    createErrorUpdater(),
    createStationUpdater()
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
            appState.loadingFailed(err);
            reschedule();
        });
};


// Sparker i gang ballen
fetchAndReschedule();
