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

    this.modelGeoData.bindGeoDataChanged(this.onGeoDataChangeHandler);
    this.modelWeather.bindWeatherChanged(this.onWeatherChangeHandler);

    this.getIPLocation();
  }

  ///// INITIAL APP LOAD - USE IP ADDRESS TO GET LAT AND LONG /////
  async getIPLocation() {
    try {
      const {
        data: { latitude, longitude },
      } = await axios.get(IP_API_URL);
      const { data: currentData } = await axios.get(currentWeatherURL(latitude, longitude));
      const { data: forecastData } = await axios.get(forecastWeatherURL(latitude, longitude));

      this.modelWeather.updateWeatherData(currentData, forecastData);
    } catch (error) {
      console.log(error);
    }
  }

  ////// GET WEATHER FROM THE BROWSER LOCATION ///////
  async getWeatherFromLocation() {
    try {
      const { latitude, longitude } = await this.getLocation();
      const { data: currentData } = await axios.get(currentWeatherURL(latitude, longitude));
      const { data: forecastData } = await axios.get(forecastWeatherURL(latitude, longitude));
      this.modelWeather.updateWeatherData(currentData, forecastData);
    } catch (error) {
      console.log(error);
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
      // VALIDATE THE INPUT USING JOI
      const schema = joi.object({ location: joi.string().required().min(3) });
      await schema.validateAsync({ location: placeQuery });

      const { data } = await axios.get(geoCodingURL(placeQuery));
      if (data.length === 0) return;

      this.modelGeoData.updateFoundPlacesData(data);
    } catch (error) {
      console.log(error);
    }
  }

  ////// PLACE CHOSEN FROM LIST ///////
  async getWeatherFromPlace({ latitude, longitude, name }) {
    // takes a place object from the drop down selection
    try {
      // fetch and display the weather
      const { data: currentData } = await axios.get(currentWeatherURL(latitude, longitude));
      const { data: forecastData } = await axios.get(forecastWeatherURL(latitude, longitude));

      // "correct" the place name -use the one returned from the geocoding API to ensure
      // consistency between search box and the displayed place name.
      currentData.name = name;
      this.modelWeather.updateWeatherData(currentData, forecastData);
    } catch (e) {
      console.log(e);
    }
  }
  /////// EVENT HANDLERS //////

  onWeatherChangeHandler = (weatherData) => {
    this.view.updateWeatherOnScreen(weatherData);
  };

  onGeoDataChangeHandler = (foundPlaces, savedPlaces) => {
    this.view.openPlacesList(foundPlaces, savedPlaces);
  };

  handleGPSButtonClick = () => {
    this.getWeatherFromLocation();
  };

  handleLocationInputChange = (inputText) => {
    this.getPlacesFromInput(inputText);
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
    console.log("delete", id);
    this.modelGeoData.deleteFromSavedPlaces(id);
  };
}
