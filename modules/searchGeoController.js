import { updateInterface } from "./interface.js";
import { forecastWeatherURL, currentWeatherURL, geoCodingURL } from "./config.js";

let foundPlaces = [];
let savedPlaces = [];

const quantiseGeoData = (gd) => {
  return gd.map((item) => {
    return {
      name: item.name,
      latitude: item.lat,
      longitude: item.lon,
      label: `${item.name}${item.state ? ", " + item.state : ""}${item.country ? ", " + item.country : ""}`,
    };
  });
};

const getFoundPlacesHTML = (fp) => {
  return fp.map(({ label }, i) => `<p class="choice-found-item" id="${i}">${label}</p>`).join("") || "";
};

const getSavedPlacesHTML = (sp) => {
  if (sp.length === 0) return "";

  return (
    "<p>Saved Places</p>" +
      sp
        .map(({ label }, i) => `<div><p class="choice-saved-item" id="${i}">${label}</p><div class="delete-button" id="${i}"><div></div></div></div>`)
        .join("") || ""
  );
};

const addToSavedPlaces = (p, savedList) => {
  if (savedList.find((pList) => pList.label === p.label)) return savedList;
  savedList.push(p);
  return savedList;
};

export async function getPlacesFromInput(placeQuery) {
  try {
    // VALIDATE THE INPUT USING JOI
    const schema = joi.object({ location: joi.string().required().min(3) });
    await schema.validateAsync({ location: placeQuery });

    const { data } = await axios.get(geoCodingURL(placeQuery));
    if (data.length === 0) return;
    foundPlaces = quantiseGeoData(data);

    // BLUR DISPLAY
    document.getElementsByClassName("weather")[0].classList.add("weather-loading");

    // SHOW POPUP
    document.getElementsByClassName("choices")[0].classList.add("choices-show");

    // DISPLAY CHOICES FOUND OVERLAY
    document.getElementsByClassName("choices-found")[0].innerHTML = getFoundPlacesHTML(foundPlaces);

    // ADD PREVIOUSLY SAVES CHOICES (if available)
    document.getElementsByClassName("choices-saved")[0].innerHTML = getSavedPlacesHTML(savedPlaces);
  } catch (error) {
    console.log(error);
  }
}

export async function placeChosenHandler(event) {
  const chosenPlace = event.target.className === "choice-found-item" ? foundPlaces[Number(event.target.id)] : savedPlaces[Number(event.target.id)];

  console.log("chosen place", chosenPlace);

  const { label, name, latitude, longitude } = chosenPlace;

  // Add this to the saved places list
  savedPlaces = addToSavedPlaces(chosenPlace, savedPlaces);

  // const {name, state, }
  // set the chosen place into the input menu
  const locationInput = document.getElementById("location");
  locationInput.value = label;

  // hide the popup choices menu
  document.getElementsByClassName("choices-found")[0].innerHTML = "";
  document.getElementsByClassName("choices-saved")[0].innerHTML = "";
  document.getElementsByClassName("choices")[0].classList.remove("choices-show");

  // fetch and display the weather
  const { data: currentData } = await axios.get(currentWeatherURL(latitude, longitude));
  const { data: forecastData } = await axios.get(forecastWeatherURL(latitude, longitude));

  // "correct" the place name -use the one returned from the geocoding API to ensure
  // consistency between search box and the displayed place name.
  currentData.name = name;

  updateInterface(currentData, forecastData);

  // Unblur the screen
  document.getElementsByClassName("weather")[0].classList.remove("weather-loading");
}

export function deleteSavedPlaceHandler(event) {
  console.log("ID", event.target.id);
  savedPlaces.splice(Number(event.target.id), 1);
  console.log("SAVEDPLACES", savedPlaces);
  document.getElementsByClassName("choices-saved")[0].innerHTML = getSavedPlacesHTML(savedPlaces);
}
