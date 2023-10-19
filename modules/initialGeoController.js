// For an intiial weather reading, use the IP address
// of the user.

import { IP_API_URL } from "./config.js";
import { forecastWeatherURL, currentWeatherURL } from "./config.js";
import { updateInterface } from "./interface.js";

export async function getIPLocation() {
  try {
    const {
      data: { latitude, longitude },
    } = await axios.get(IP_API_URL);
    const { data: currentData } = await axios.get(currentWeatherURL(latitude, longitude));
    const { data: forecastData } = await axios.get(forecastWeatherURL(latitude, longitude));
    console.log(currentData);
    console.log(forecastData);
    updateInterface(currentData, forecastData);
  } catch (error) {
    console.log(error);
  }
}
