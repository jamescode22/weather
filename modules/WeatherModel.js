export class WeatherModel {
  constructor() {
    this.weatherData = {};
  }

  bindWeatherChanged(callback) {
    this.onWeatherChanged = callback;
  }

  updateWeatherData(currentData, forecastData) {
    // Takes raw data from the APIs and saves it into
    // the custom object structure (this.weatherData)

    // Helper function
    const dayToString = (d) => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d];

    // MAKE FORECAST DATA ARRAY
    const forecastItems = [];
    const todaytoday = dayToString(new Date().getDay());

    forecastData.list.forEach((item) => {
      const itemWeatherDate = new Date(item.dt * 1000);
      const day = dayToString(itemWeatherDate.getDay());
      const time = `${String(itemWeatherDate.getUTCHours()).padStart(2, 0)}:${String(itemWeatherDate.getUTCMinutes()).padStart(2, 0)}`;

      // only keep forecasts for 12:00, exclude today
      if (time !== "12:00") return;
      if (day === todaytoday) return;

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

    // CURRENTDATA DATA

    const currentWeatherDate = new Date(currentData.dt * 1000);
    const today = currentWeatherDate.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const time = `${String(currentWeatherDate.getHours()).padStart(2, 0)}:${String(currentWeatherDate.getMinutes()).padStart(2, 0)}`;

    this.weatherData = {
      temp: Math.round(currentData.main.temp),
      tempMin: Math.round(currentData.main.temp_min),
      tempMax: Math.round(currentData.main.temp_max),
      city: currentData.name,
      today,
      time,
      icon: `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`,
      description: currentData.weather[0].description,
      forecast: forecastItems,
    };

    console.log("END OF UPDATEWEATHER", this.weatherData);

    this.onWeatherChanged(this.weatherData);
  }
}
