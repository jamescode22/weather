import { getWeatherFromLocation } from "./modules/locationGeoController.js";
import { placeChosenHandler, deleteSavedPlaceHandler, getPlacesFromInput } from "./modules/searchGeoController.js";
import { getIPLocation } from "./modules/initialGeoController.js";

// BEGIN LISTENING FOR INPUT FROM SEARCH BOX
const locationInput = document.getElementById("location");
let locationInputValue = "";

locationInput.addEventListener("input", (e) => {
  locationInputValue = e.target.value;
  getPlacesFromInput(locationInputValue);
});

// WAIT FOR A CLICK ON THE GEO BUTTON
const gpsButtonRef = document.getElementById("gps-button");
gpsButtonRef.addEventListener("click", () => {
  getWeatherFromLocation();
});

// SOMETHING SELECTED ON THE LOCATION CHOICES DROPDOWN
const choicesMenuRef = document.getElementsByClassName("choices")[0];
choicesMenuRef.addEventListener("click", (e) => {
  console.log("CLICK", e.target.className);
  if (e.target.className === "choice-found-item" || e.target.className === "choice-saved-item") {
    placeChosenHandler(e);
  }
  if (e.target.className === "delete-button") {
    deleteSavedPlaceHandler(e);
  }
});

getIPLocation();
