const rp = require('request-promise-native');


const createHeaders = (apiKey) => {
    return {
        'Content-Type': 'application/json',
        'Client-Identifier': apiKey
    };
};

const createOptions = (apiKey, path) => {
    return {
        uri: 'https://oslobysykkel.no/api/v1' + path,
        headers: createHeaders(apiKey),
        json: true
    };
};

const mapById = (arr) => {
    const reducer = (mapped, data) => {
        mapped[data.id] = data;
        return mapped;
    };

    return arr.reduce(reducer, {});
};

const random = (max) => Math.floor(Math.random() * Math.floor(max));

module.exports.createClient = (apiKey) => {
    const get = (path) => {
        return rp(createOptions(apiKey, path));
    };

    return () => {
        const availabilityReq = get('/stations/availability').then(r => r.stations);
        const stationsReq = get('/stations').then(r => r.stations); // Her kunne vi sikkert cachet resultatet en stund
        const statusReq = get('/status').then(r => r.status);

        return Promise.all([ stationsReq, statusReq, availabilityReq ]).then((d) => {
            const stationsResponse = d[0];
            const statusResponse = d[1];
            const availabilityResponse = mapById(d[2]);

            return stationsResponse.map(s => {
               return {
                   id: s.id,
                   title: s.title,
                   subtitle: s.subtitle,
                   number_of_locks: s.number_of_locks,
                   availability: availabilityResponse[s.id] ? availabilityResponse[s.id].availability : { bikes: -1, locks: -1 },
                   // availability: { bikes: random(10), locks: random(20) }, // For å teste oppdatering
                   closed: statusResponse.all_stations_closed ? true : statusResponse.stations_closed.indexOf(s.id) > -1 // Manglet dok. antar at stations_closed er et array med stasjonens id
                   //closed: random(10) > 7
               };
            });
        });
    }
};