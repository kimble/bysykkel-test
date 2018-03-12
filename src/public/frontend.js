"use strict";

const containerElement = document.getElementById("stations");


const fetchData = () => fetch('/proxy').then(r => r.json());


