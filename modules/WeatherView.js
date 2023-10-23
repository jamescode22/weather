export class WeatherView {
  constructor() {
    // Create references back to the DOM elements
    this.autoGen = this.getElement("#auto-gen");
    this.LocationInput = this.getElement("#location");
    this.weather = this.getElement(".weather");
    this.choices = this.getElement(".choices");
    this.choicesFound = this.getElement(".choices-found");
    this.choicesSaved = this.getElement(".choices-saved");
    this.gpsButtonRef = document.getElementById("gps-button");
    this.errorOverlay = this.getElement(".error-overlay");
    this.loadingSpinner = this.getElement(".lds-ring");
  }

  // SET UP EVENT LISTENER HANDLERS
  bindLocationClickHandler(handler) {
    this.gpsButtonRef.addEventListener("click", () => {
      handler();
    });
  }

  bindLocationInputBoxChangedHandler(handler) {
    this.LocationInput.addEventListener("input", (e) => {
      handler(e.target.value);
    });
  }

  bindLocationInputBoxHasFocusHandler(handler) {
    this.LocationInput.addEventListener("focus", (e) => {
      handler(e);
    });
  }

  bindPlacesListClickHandlers(placeClickHandler, deleteSavedPlaceHandler) {
    this.choices.addEventListener("click", (e) => {
      if (e.target.className === "choice-found-item" || e.target.className === "choice-saved-item") {
        placeClickHandler(e.target.className, parseInt(e.target.id));
      }
      if (e.target.className === "delete-button") {
        deleteSavedPlaceHandler(parseInt(e.target.id));
      }
    });
  }

  getElement(selector) {
    return document.querySelector(selector);
  }

  getFoundPlacesHTML = (fp) => {
    // Takes an array of geo objects (for found locations), returns HTML for dropdown list
    if (fp.length === 0) return "<p>Start typing to find a location...</p>";
    return fp.map(({ label }, i) => `<p class="choice-found-item" id="${i}">${label}</p>`).join("") || "";
  };

  getSavedPlacesHTML = (sp) => {
    // Takes an array of geo objects (for saved places), returns HTML for dropdown list
    if (sp.length === 0) return "";
    return (
      "<p>Saved Places</p>" +
        sp
          .map(
            ({ label }, i) => `<div><p class="choice-saved-item" id="${i}">${label}</p><div class="delete-button" id="${i}"><div></div></div></div>`
          )
          .join("") || ""
    );
  };

  setLocationInputValue(val) {
    this.LocationInput.value = val;
  }

  openPlacesList(foundPlaces, savedPlaces) {
    // Takes an array of geo objects for foundPlaces and savedPlaces and displays the popup form

    // BLUR DISPLAY
    this.weather.classList.add("weather-loading");

    // SHOW POPUP
    this.choices.classList.add("choices-show");

    // DISPLAY CHOICES FOUND OVERLAY
    this.choicesFound.innerHTML = this.getFoundPlacesHTML(foundPlaces);

    // ADD PREVIOUSLY SAVES CHOICES (if available)
    this.choicesSaved.innerHTML = this.getSavedPlacesHTML(savedPlaces);
  }

  closePlacesList() {
    this.choicesFound.innerHTML = "";
    this.choicesSaved.innerHTML = "";
    this.choices.classList.remove("choices-show");
    this.weather.classList.remove("weather-loading");
  }

  updateWeatherOnScreen(weatherData, isLoading, errorMessage) {
    // clear all error and loading elements
    this.weather.classList.remove("weather-loading");
    this.loadingSpinner.classList.remove("lds-ring-show");
    this.errorOverlay.classList.remove("error-overlay-show");

    if (isLoading) {
      this.weather.classList.add("weather-loading");
      this.loadingSpinner.classList.add("lds-ring-show");
    }

    if (errorMessage) {
      this.loadingSpinner.classList.remove("lds-ring-show");
      this.weather.classList.add("weather-loading");
      this.errorOverlay.textContent = errorMessage;
      this.errorOverlay.classList.add("error-overlay-show");
    }

    // Set up default values if there is no weather data (this will appear blurred)
    const {
      city = "City or Town",
      today = "1st January 1000",
      time = "12:00",
      icon = "https://openweathermap.org/img/wn/03n@2x.png",
      temp = "50",
      tempMin = "00",
      tempMax = "99",
      description = "Some weather",
      sunset = "00:00",
      sunrise = "00:00",
      forecast = [
        { day: "Someday", icon: "https://openweathermap.org/img/wn/03n@2x.png", temp: "99", main: "Weather" },
        { day: "Someday", icon: "https://openweathermap.org/img/wn/03n@2x.png", temp: "99", main: "Weather" },
        { day: "Someday", icon: "https://openweathermap.org/img/wn/03n@2x.png", temp: "99", main: "Weather" },
        { day: "Someday", icon: "https://openweathermap.org/img/wn/03n@2x.png", temp: "99", main: "Weather" },
      ],
      latertoday = [
        { time: "00:00", icon: "https://openweathermap.org/img/wn/03n@2x.png", temp: "99", main: "Weather" },
        { time: "00:00", icon: "https://openweathermap.org/img/wn/03n@2x.png", temp: "99", main: "Weather" },
        { time: "00:00", icon: "https://openweathermap.org/img/wn/03n@2x.png", temp: "99", main: "Weather" },
      ],
    } = weatherData;

    this.autoGen.innerHTML = `
          <div class="loc-and-time">
              <div>
                <h2>${city}</h2>
                <p><span>${today}</span></p>
                <p>Weather updated at ${time}</p>
              </div>
              <div>
              <p>Sunrise: ${sunrise}</p>
                <p>Sunset: ${sunset}</p>
              </div>
          </div>
      
          <div class="weather-data">
            <img src="${icon}" />
            <div>
              <h3>${temp}&deg;C</h3>
              <h4>${tempMin} - ${tempMax}&deg;C</h4>
            </div>
            <p>${description}</p>
          </div>

          <div class="later-today">
          ${latertoday
            .map(
              (item) => `
            <div>
              <h4>${item.time}</h4>
              <img src="${item.icon}">
              <p>${item.main}</p>
              <p>${item.temp}&deg;C</p>
            </div>`
            )
            .join("")}
            </div>
              
          <div class="weather-forecast">
            ${forecast
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
}
