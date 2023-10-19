// API KEY
const OWM_API_KEY = `071a5ac51515a32204c01d5f04dcd753`;

export const forecastWeatherURL = (lat, long) =>
  `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=metric&appid=${OWM_API_KEY}`;

export const currentWeatherURL = (lat, long) =>
  `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${OWM_API_KEY}`;

export const geoCodingURL = (placeQuery) => `https://api.openweathermap.org/geo/1.0/direct?q=${placeQuery}&limit=10&appid=${OWM_API_KEY}`;

export const IP_API_URL = `https://ipapi.co/json/`;
