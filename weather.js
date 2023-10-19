import { getWeatherFromInput } from "./modules/searchGeoController.js";
import { getWeatherFromLocation } from "./modules/locationGeoController.js";
import { locationChoiceHandler } from "./modules/searchGeoController.js";
import { getIPLocation } from "./modules/initialGeoController.js";

// BEGIN LISTENING FOR INPUT FROM SEARCH BOX
const locationInput = document.getElementById("location");
let locationInputValue = "";

locationInput.addEventListener("input", (e) => {
  locationInputValue = e.target.value;
  getWeatherFromInput(locationInputValue);
});

// WAIT FOR A CLICK ON THE GEO BUTTON
const gpsButtonRef = document.getElementById("gps-button");
gpsButtonRef.addEventListener("click", () => {
  getWeatherFromLocation();
});

// SOMETHING SELECTED ON THE LOCATION CHOICES DROPDOWN
const choicesMenuRef = document.getElementsByClassName("choices")[0];
choicesMenuRef.addEventListener("click", (e) => {
  locationChoiceHandler(e);
});

getIPLocation();
