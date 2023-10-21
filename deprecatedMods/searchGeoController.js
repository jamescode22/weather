// import { updateWeatherOnScreen, openPlacesList, closePlacesList } from "./interface.js";
import { forecastWeatherURL, currentWeatherURL, geoCodingURL } from "./config.js";
import { Weather } from "./Weather.js";
import { WeatherView } from "./WeatherView.js";

let foundPlaces = [];
let savedPlaces = [];

const _wv = new WeatherView();

const quantiseGeoData = (gd) => {
  // IN: data object from OWM geo api
  // OUT: flat object with just required info, plus a label to use for dropdown list.
  return gd.map((item) => {
    return {
      name: item.name,
      latitude: item.lat,
      longitude: item.lon,
      label: `${item.name}${item.state ? ", " + item.state : ""}${item.country ? ", " + item.country : ""}`,
    };
  });
};

const addToSavedPlaces = (p, savedList) => {
  // Takes a geolist object p, and adds it to the savedlist if it's not
  // already in it.  Returns the mutated savelist.
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

    _wv.openPlacesList(foundPlaces, savedPlaces);
  } catch (error) {
    console.log(error);
  }
}

export async function placeChosenHandler(event) {
  // Get the correct geo object (from found list or saved list)
  const chosenPlace = event.target.className === "choice-found-item" ? foundPlaces[Number(event.target.id)] : savedPlaces[Number(event.target.id)];
  const { label, name, latitude, longitude } = chosenPlace;

  // Add this to the saved places list
  savedPlaces = addToSavedPlaces(chosenPlace, savedPlaces);

  // set the chosen place into the input menu
  const locationInput = document.getElementById("location");
  locationInput.value = label;

  // Close the places list
  _wv.closePlacesList();

  try {
    // fetch and display the weather
    const { data: currentData } = await axios.get(currentWeatherURL(latitude, longitude));
    const { data: forecastData } = await axios.get(forecastWeatherURL(latitude, longitude));

    // "correct" the place name -use the one returned from the geocoding API to ensure
    // consistency between search box and the displayed place name.
    currentData.name = name;

    // create a new weather instance
    const _w = new Weather(currentData, forecastData);
    _wv.updateWeatherOnScreen(_w);
  } catch (e) {
    console.log(e);
  }
}

export function deleteSavedPlaceHandler(event) {
  savedPlaces.splice(Number(event.target.id), 1);
  _wv.openPlacesList(foundPlaces, savedPlaces);
}
