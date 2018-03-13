Bysykkel test
=============

Eksperimenterer litt med [bysykkel api-et](https://developer.oslobysykkel.no/api) til Oslo Kommune. Fikk samtidig testet ut hvordan [Express.JS](https://expressjs.com/) fungerer
som en proxy for enkle prosjekter som dette. 

Alle stasjonene var stengt når jeg puslet med dette og dokumentasjonen var litt mangelfull så jeg har gjort
noen antagelser her og der. 

Hvordan kjøre det opp lokalt?
-----------------------------
Koden er utviklet med NodeJS v9.8.0. Jeg er ikke fryktelig kjent med Node så jeg tør ikke å garantere at jeg
ikke har brukt noe som ikke er tilgjengelig i tidligere versjoner :-)

    git clone git@github.com:kimble/bysykkel-test.git
    npm install
    API_KEY=***** node server.js

Screenshot
----------
![Screenshot](https://github.com/kimble/bysykkel-test/raw/master/docs/screenshot.png)