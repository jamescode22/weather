export function setToIntroScreen() {
  document.getElementById("auto-gen").innerHTML = `
  <div class="intro-screen">
    <p>Type a place into the box, or click the GPS icon to find your current location.</p>
  </div>`;
}

export function setToLoadingScreen() {
  document.getElementById("auto-gen").innerHTML = `
    <div class="intro-screen">
      <div class="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    </div>`;
}

export function updateInterface(currentData, forecastData) {
  // HELPER - converts results from getDay() to a nice string
  function dayToString(dayNumber) {
    return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][dayNumber - 1];
  }

  // CURRENT WEATHER - prepare data for HTML templates
  const currentWeatherDate = new Date(currentData.dt * 1000);

  const weatherCurrent = {
    icon: `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`,
    time: `${String(currentWeatherDate.getHours()).padStart(2, 0)}:${String(currentWeatherDate.getMinutes()).padStart(2, 0)}`,
    description: currentData.weather[0].description,
    city: currentData.name,
    today: currentWeatherDate.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    temp: Math.round(currentData.main.temp),
    tempMin: Math.round(currentData.main.temp_min),
    tempMax: Math.round(currentData.main.temp_max),
  };

  // FORECAST DATA - prepare date for HTML templates
  const weatherForecastAll = forecastData.list.map((item) => {
    return {
      icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
      day: dayToString(new Date(item.dt * 1000).getDay()),
      time: `${String(new Date(item.dt * 1000).getUTCHours()).padStart(2, 0)}:${String(new Date(item.dt * 1000).getUTCMinutes()).padStart(2, 0)}`,
      main: item.weather[0].main,
      description: item.weather[0].description,
      temp: Math.round(item.main.temp),
      tempMin: Math.round(item.main.temp_min),
      tempMax: Math.round(item.main.temp_max),
    };
  });

  // FILTER WEATHER FORECAST ARRAY - ONLY KEEP
  // FORECASTS FOR 12:00, EXCLUDE TODAY
  const weatherForecast = weatherForecastAll.filter((item) => item.time === "12:00" && item.day !== dayToString(new Date().getDay()));

  // Depending on current time of day, there may be 4 or 5 future 12:00 forecasts
  // available.  To ensure design doesn't break, clip the weatherForecast array to 4 items.
  weatherForecast.length = 4;

  document.getElementById("auto-gen").innerHTML = `
  <div class="loc-and-time">
        <div>
          <h2>${weatherCurrent.city}</h2>
          <p><span>${weatherCurrent.today}</span></p>
        </div>
        <p>Weather last updated at ${weatherCurrent.time}</p>
        </div>

        <div class="weather-data">
    <img src="${weatherCurrent.icon}" />
    <div>
        <h3>${weatherCurrent.temp}&deg;C</h3>
        <h4>${weatherCurrent.tempMin} - ${weatherCurrent.tempMax}&deg;C</h4>
    </div>
    <p>${weatherCurrent.description}</p>
    
    </div>
    <div class="weather-forecast">
      ${weatherForecast
        .map(
          (item) => `<div>
                      <h3>${item.day}</h3>
                      <img src="${item.icon}">
                      <p>${item.temp}&deg;C</p>
                      <p>${item.main}</p>
                      </div>`
        )
        .join("")}
        </div>
        </div>`;
}
