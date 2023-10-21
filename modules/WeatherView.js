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
    console.log("Weatherviewcons");
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
    if (fp.length === 0) return "";
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

  updateWeatherOnScreen(weatherData) {
    // Display the WeatherModel weather data
    console.log("view", weatherData);

    this.autoGen.innerHTML = `
        <div class="loc-and-time">
              <div>
                <h2>${weatherData.city}</h2>
                <p><span>${weatherData.today}</span></p>
              </div>
              <p>Weather last updated at ${weatherData.time}</p>
              </div>
      
              <div class="weather-data">
          <img src="${weatherData.icon}" />
          <div>
              <h3>${weatherData.temp}&deg;C</h3>
              <h4>${weatherData.tempMin} - ${weatherData.tempMax}&deg;C</h4>
          </div>
          <p>${weatherData.description}</p>
          
          </div>
          <div class="weather-forecast">
            ${weatherData.forecast
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
