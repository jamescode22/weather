// API KEY

export const forecastWeatherURL = (lat, long) =>
  `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=metric&appid=071a5ac51515a32204c01d5f04dcd753`;

export const currentWeatherURL = (lat, long) =>
  `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=071a5ac51515a32204c01d5f04dcd753`;

export const geoCodingURL = (placeQuery) =>
  `http://api.openweathermap.org/geo/1.0/direct?q=${placeQuery}&limit=10&appid=071a5ac51515a32204c01d5f04dcd753`;
