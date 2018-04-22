const frontend = require('../../public/frontend');




const createTestSession = () => {
    let currentState = null;

    const api = frontend.createAppState([
        (state) => {
            currentState = state;
        }
    ]);

    const readCurrentState = () => currentState;

    return {
        api, readCurrentState
    }
};

const initialState = {
    error: false,
    loading: false,
    stations: []
};

const createStationFactory = () => {
    let idCounter = 0;

    const defaultState = {
        id: -1,
        closed: false,
        title: "Default title",
        subtitle: "...",
        number_of_locks: 10,
        availability: {
            bikes: 5,
            locks: 5
        }
    };

    return (override) => {
        let defaultOverride = { id: ++idCounter };
        let next = { ...defaultState, defaultOverride };
        return { ...next, override };
    };
};





describe('Oppdatering av tilstand', () => {
    const session = createTestSession();
    const stationFactory = createStationFactory();

    test('Flagger lasting', () => {
        session.api.loadingData();

        expect(session.readCurrentState()).toEqual({
            ...initialState,
            loading: true
        });
    });

    test('Ved feil fires lasting flagget og feilmelding oppdaterer seg', () => {
        session.api.loadingData();
        session.api.loadingFailed("Oups..");

        expect(session.readCurrentState()).toEqual({
            ...initialState,
            loading: false,
            error: 'Oups..'
        });
    });


    test('Når vi setter listen med stasjoner fjernes fires flagget ned', () => {
        const stations = [
            stationFactory({ title: 'Stasjon A' }),
            stationFactory({ title: 'Stasjon B' })
        ];

        session.api.loadingData();
        session.api.dataLoaded(stations);

        expect(session.readCurrentState()).toEqual({
            ...initialState,
            loading: false,
            stations: stations
        });
    });
});



