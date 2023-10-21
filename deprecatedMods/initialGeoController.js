// For an intiial weather reading, use the IP address
// of the user.

import { IP_API_URL } from "../modules/config.js";
import { forecastWeatherURL, currentWeatherURL } from "../modules/config.js";
// import { updateWeatherOnScreen } from "./interface.js";
import { Weather } from "../modules/Weather.js";
import { WeatherView } from "../modules/WeatherView.js";

export async function getIPLocation() {
  try {
    const {
      data: { latitude, longitude },
    } = await axios.get(IP_API_URL);
    const { data: currentData } = await axios.get(currentWeatherURL(latitude, longitude));
    const { data: forecastData } = await axios.get(forecastWeatherURL(latitude, longitude));

    const _w = new Weather(currentData, forecastData);
    const _wv = new WeatherView();

    _wv.updateWeatherOnScreen(_w);
  } catch (error) {
    console.log(error);
  }
}
