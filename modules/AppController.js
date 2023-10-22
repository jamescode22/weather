import { IP_API_URL, currentWeatherURL, forecastWeatherURL, geoCodingURL } from "./config.js";

export class AppController {
  constructor(modelWeather, modelGeoData, view) {
    this.modelWeather = modelWeather;
    this.modelGeoData = modelGeoData;
    this.view = view;

    /// BIND EVENT HANDLERS TO VIEW AND MODEL
    this.view.bindLocationClickHandler(this.handleGPSButtonClick);
    this.view.bindLocationInputBoxChangedHandler(this.handleLocationInputChange);

    this.view.bindPlacesListClickHandlers(this.handlePlaceClick, this.handleDeleteClick);
    this.view.bindLocationInputBoxHasFocusHandler(this.handleLocationInputHasFocus);

    this.modelGeoData.bindGeoDataChanged(this.onGeoDataChangeHandler);

    this.modelWeather.bindWeatherChanged(this.onWeatherChangeHandler);
    this.modelWeather.bindWeatherLoadError(this.onWeatherLoadErrorHandler);
    this.view.updateWeatherOnScreen({}, true, false);

    this.getIPLocation();
  }

  ///// INITIAL APP LOAD - USE IP ADDRESS TO GET LAT AND LONG /////
  async getIPLocation() {
    try {
      const {
        data: { latitude, longitude },
      } = await axios.get(IP_API_URL);

      this.modelWeather.updateWeatherDataFromLatAndLong(latitude, longitude);
    } catch (error) {
      this.view.updateWeatherOnScreen({}, false, error);
    }
  }

  ////// GET WEATHER FROM THE BROWSER LOCATION ///////
  async getWeatherFromLocation() {
    try {
      this.view.updateWeatherOnScreen({}, true, false);
      const { latitude, longitude } = await this.getLocation();
      this.modelWeather.updateWeatherDataFromLatAndLong(latitude, longitude);
    } catch (error) {
      this.view.updateWeatherOnScreen({}, false, error);
    }
  }

  async getLocation() {
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

  ////// LOCATION SEARCH BOX /////

  async getPlacesFromInput(placeQuery) {
    try {
      // If input text is less than three letters, don't do anything
      if (placeQuery.length < 3) return;

      const { data } = await axios.get(geoCodingURL(placeQuery));
      if (data.length === 0) return;

      this.modelGeoData.updateFoundPlacesData(data);
    } catch (error) {
      this.view.updateWeatherOnScreen({}, error);
    }
  }

  ////// PLACE CHOSEN FROM LIST ///////
  async getWeatherFromPlace({ latitude, longitude, name }) {
    // takes a place object from the drop down selection
    try {
      // tell the model to get the weather from this lat and long, and override city name
      this.modelWeather.updateWeatherDataFromLatAndLong(latitude, longitude, name);
    } catch (e) {
      this.view.updateWeatherOnScreen({}, e);
    }
  }
  /////// EVENT HANDLERS //////

  onWeatherChangeHandler = (weatherData) => {
    this.view.updateWeatherOnScreen(weatherData);
  };

  onGeoDataChangeHandler = (foundPlaces, savedPlaces) => {
    this.view.updateWeatherOnScreen({});
    this.view.openPlacesList(foundPlaces, savedPlaces);
  };

  onWeatherLoadErrorHandler = (weatherData, error) => {
    this.view.updateWeatherOnScreen({}, false, error);
  };

  handleGPSButtonClick = () => {
    this.getWeatherFromLocation();
  };

  handleLocationInputChange = (inputText) => {
    this.getPlacesFromInput(inputText);
  };

  handleLocationInputHasFocus = (e) => {
    // user has clicked or otherwise focussed on the input box.
    this.view.updateWeatherOnScreen({}, false, false);
    this.view.setLocationInputValue("");
    this.modelGeoData.prepareToFindPlaces();
  };

  handlePlaceClick = (className, id) => {
    // a click on the places drop down list
    const chosenPlace = this.modelGeoData.getPlaceFromClassAndID(className, id);
    this.modelGeoData.addToSavedPlaces(chosenPlace);
    this.view.closePlacesList();
    this.view.setLocationInputValue(chosenPlace.label);
    this.getWeatherFromPlace(chosenPlace);
  };

  handleDeleteClick = (id) => {
    // deleting a saved place from the drop down list
    this.modelGeoData.deleteFromSavedPlaces(id);
  };
}
