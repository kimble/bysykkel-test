const frontend = require('../../public/frontend');




const createTestSession = () => {
    let currentState = null;

    const api = frontend.createAppState([
        (state) => {
            console.log("Got new state", state);
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



describe('Oppdatering av tilstand', () => {
    const session = createTestSession();

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


});



