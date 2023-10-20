export class Weather {
  constructor(currentData, forecastData) {
    // TAKES AND SAVES THE DIRECT RETURN FROM
    // THE OWM API
    this.currentData = currentData;
    this.forecastData = forecastData;
    this.currentWeatherDate = new Date(currentData.dt * 1000);
  }

  get temp() {
    return Math.round(this.currentData.main.temp);
  }

  get tempMin() {
    return Math.round(this.currentData.main.temp_min);
  }

  get tempMax() {
    return Math.round(this.currentData.main.temp_max);
  }

  get city() {
    return this.currentData.name;
  }

  get today() {
    return this.currentWeatherDate.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  get time() {
    return `${String(this.currentWeatherDate.getHours()).padStart(2, 0)}:${String(this.currentWeatherDate.getMinutes()).padStart(2, 0)}`;
  }

  get icon() {
    return `https://openweathermap.org/img/wn/${this.currentData.weather[0].icon}@2x.png`;
  }

  get description() {
    return this.currentData.weather[0].description;
  }

  get forecast() {
    // returns a 4 day forecast as an array of objects
    const dayToString = (d) => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d];

    const forecastItems = [];
    const today = dayToString(new Date().getDay());

    this.forecastData.list.forEach((item) => {
      const itemWeatherDate = new Date(item.dt * 1000);
      const day = dayToString(itemWeatherDate.getDay());
      const time = `${String(itemWeatherDate.getUTCHours()).padStart(2, 0)}:${String(itemWeatherDate.getUTCMinutes()).padStart(2, 0)}`;

      // only keep forecasts for 12:00, exclude today
      if (time !== "12:00") return;
      if (day === today) return;

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
    return forecastItems;
  }
}
