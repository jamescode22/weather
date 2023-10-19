import { updateInterface } from "./interface.js";
import { forecastWeatherURL, currentWeatherURL } from "./config.js";

export async function getWeatherFromLocation() {
  try {
    const { latitude, longitude } = await getLocation();
    const { data: currentData } = await axios.get(currentWeatherURL(latitude, longitude));
    const { data: forecastData } = await axios.get(forecastWeatherURL(latitude, longitude));
    updateInterface(currentData, forecastData);
  } catch (error) {
    console.log(error);
  }
}

async function getLocation() {
  return new Promise(function (resolve, reject) {
    // GET BROWSER LOCATION //

    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 2000,
    });

    function success({ coords }) {
      resolve(coords);
    }

    function error({ message }) {
      reject(`${message}. Enable location services in your browser.`);
    }
  });
}
