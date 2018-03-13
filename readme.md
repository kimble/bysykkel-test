Bysykkel test
=============

Eksperimenterer litt med [bysykkel api-et](https://developer.oslobysykkel.no/api) til Oslo Kommune. Fikk samtidig 
testet ut hvordan [Express.JS](https://expressjs.com/) fungerer som en proxy for enkle prosjekter som dette. 
Frontend er implementert med [d3.js](https://d3js.org) og et veldig enkelt pattern for oversiktelig mutering av 
tilstand og separasjon av koden som oppdaterer forskjellige deler av skjermbildet. Dette er selvfølgelig bare skrevet
for moroskyld og kun testet med Chrome.  

Alle stasjonene var stengt når jeg puslet med dette og dokumentasjonen var litt mangelfull så jeg har gjort
noen antagelser her og der. 

Hvordan kjøre det opp lokalt?
-----------------------------
Koden er utviklet med NodeJS v9.8.0. Jeg er ikke fryktelig kjent med Node så jeg tør ikke å garantere at jeg
ikke har brukt noe som ikke er tilgjengelig i tidligere versjoner :-)


### Uten Docker

    git clone git@github.com:kimble/bysykkel-test.git
    cd bysykkel-test
    npm install
    API_KEY=*** node server.js

### Med Docker

Har du Docker installert kan du bygge et image og spinne det opp i en container:

    git clone git@github.com:kimble/bysykkel-test.git
    cd bysykkel-test
    docker build --tag bysykkel-test . 
    docker run -it --rm=true -e API_KEY=*** -p 3000:3000 bysykkel-test:latest 
    
### Ta-da

Om alt har gått etter planen har du nå en veldig enkel bysykkel server kjørende på http://localhost:3000/


![Screenshot](https://github.com/kimble/bysykkel-test/raw/master/docs/screenshot.png)