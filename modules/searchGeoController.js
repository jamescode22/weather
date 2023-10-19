import { updateInterface } from "./interface.js";
import { forecastWeatherURL, currentWeatherURL, geoCodingURL } from "./config.js";

let geoData = [];

const makePlaceLabel = (item) => {
  // Takes a single data item returned from API and creates a label
  // in the format City, State, Country, dealing with any undefined variables
  return `${item.name}${item.state ? ", " + item.state : ""}${item.country ? ", " + item.country : ""}`;
};

export async function getWeatherFromInput(placeQuery) {
  try {
    // VALIDATE THE INPUT USING JOI
    const schema = joi.object({ location: joi.string().required().min(3) });
    await schema.validateAsync({ location: placeQuery });

    // CALL GEOCODING API - get lat/long for entered place name
    const { data } = await axios.get(geoCodingURL(placeQuery));

    // Check that something has been found, and that the found location
    // matches the input string
    if (data.length === 0) return;
    // if (String(geoData[0].name).toLowerCase().substring(0, placeQuery.length) !== placeQuery.toLowerCase()) return;

    // Add label to object for each item
    geoData = data.map((item) => {
      console.log("F", makePlaceLabel(item));
      return { ...item, label: makePlaceLabel(item) };
    });

    console.log(geoData);

    // BLUR DISPLAY
    document.getElementsByClassName("weather")[0].classList.add("weather-loading");

    // DISPLAY CHOICES OVERLAY
    const choicesPopupHTML = geoData
      .map((item, index) => {
        return `<p id="${index}">${item.label}</p>`;
      })
      .join("");

    document.getElementsByClassName("choices")[0].innerHTML = choicesPopupHTML;
  } catch (error) {
    console.log(error);
  }
}

export async function locationChoiceHandler(event) {
  // deals with a click event on the popup choices menu
  if (event.target.id === "choices") return;

  const { label, name, lat: latitude, lon: longitude } = geoData[event.target.id];

  // const {name, state, }
  // set the chosen place into the input menu
  const locationInput = document.getElementById("location");
  locationInput.value = label;

  // hide the popup choices menu
  document.getElementsByClassName("choices")[0].innerHTML = "";

  // fetch and display the weather
  const { data: currentData } = await axios.get(currentWeatherURL(latitude, longitude));
  const { data: forecastData } = await axios.get(forecastWeatherURL(latitude, longitude));

  console.log("currentData", currentData);
  console.log("futureData", forecastData);

  // "correct" the place name -use the one returned from the geocoding API to ensure
  // consistency between search box and the displayed place name.
  currentData.name = name;

  updateInterface(currentData, forecastData);

  // Unblur the screen
  document.getElementsByClassName("weather")[0].classList.remove("weather-loading");
}
