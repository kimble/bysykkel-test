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
        const defaultOverride = { id: ++idCounter };
        return Object.assign({}, defaultState, defaultOverride, override);
    };
};





describe('Oppdatering av tilstand', () => {
    const session = createTestSession();
    const lagStasjon = createStationFactory();

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
            lagStasjon({ title: 'Stasjon A' }),
            lagStasjon({ title: 'Stasjon B' })
        ];

        session.api.loadingData();
        session.api.dataLoaded(stations);

        expect(session.readCurrentState()).toEqual({
            ...initialState,
            loading: false,
            stations: stations
        });
    });

    test('Listen sorteres etter navn', () => {
        const stations = [
            lagStasjon({ title: 'Stasjon C' }),
            lagStasjon({ title: 'Stasjon A' }),
            lagStasjon({ title: 'Stasjon B' })
        ];

        session.api.loadingData();
        session.api.dataLoaded(stations);

        const currentState = session.readCurrentState();

        expect(currentState.stations.map(s => s.title))
            .toEqual([ 'Stasjon A', 'Stasjon B', 'Stasjon C' ]);
    });
});
