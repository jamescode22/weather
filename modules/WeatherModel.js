import { currentWeatherURL, forecastWeatherURL } from "./config.js";

export class WeatherModel {
  constructor() {
    this.weatherData = {};
  }

  bindWeatherChanged(callback) {
    this.onWeatherChanged = callback;
  }

  bindWeatherLoadError(callback) {
    this.onWeatherLoadError = callback;
  }

  async updateWeatherDataFromLatAndLong(latitude, longitude, city) {
    try {
      const { data: currentData } = await axios.get(currentWeatherURL(latitude, longitude));
      const { data: forecastData } = await axios.get(forecastWeatherURL(latitude, longitude));
      if (city) currentData.name = city;

      this.updateWeatherData(currentData, forecastData);
    } catch (error) {
      this.onWeatherLoadError(this.weatherData, error);
    }
  }

  updateWeatherData(currentData, forecastData) {
    // Takes raw data from the APIs and saves it into
    // the custom object structure (this.weatherData)

    // Helper function
    const dateToString = (date) => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()];
    const dateToTimeUTC = (date) => `${String(date.getUTCHours()).padStart(2, 0)}:${String(date.getUTCMinutes()).padStart(2, 0)}`;
    const dateToTimeLocal = (date) => `${String(date.getHours()).padStart(2, 0)}:${String(date.getMinutes()).padStart(2, 0)}`;

    ////// MAKE FORECAST DATA ARRAY //////
    const forecastItems = [];

    forecastData.list.forEach((item, i) => {
      const itemWeatherDate = new Date(item.dt * 1000);
      const day = dateToString(itemWeatherDate);
      const time = dateToTimeUTC(itemWeatherDate);

      // only keep forecasts for 12:00, excluding today
      if (time !== "12:00") return;
      if (day === dateToString(new Date())) return;

      forecastItems.push({
        icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
        day,
        time,
        main: item.weather[0].main,
        temp: Math.round(item.main.temp),
      });
    });

    // Trim to 4 maximum forecast days
    forecastItems.length = 4;

    ////// CURRENT WEATHER ///////

    const currentWeatherDate = new Date(currentData.dt * 1000);
    const today = currentWeatherDate.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    this.weatherData = {
      temp: Math.round(currentData.main.temp),
      tempMin: Math.round(currentData.main.temp_min),
      tempMax: Math.round(currentData.main.temp_max),
      city: currentData.name,
      today,
      time: dateToTimeLocal(currentWeatherDate),
      icon: `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`,
      description: currentData.weather[0].description,
      forecast: forecastItems,
      sunrise: dateToTimeLocal(new Date(currentData.sys.sunrise * 1000)),
      sunset: dateToTimeLocal(new Date(currentData.sys.sunset * 1000)),
    };

    this.onWeatherChanged(this.weatherData);
  }
}
