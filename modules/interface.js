// export function setToLoadingScreen() {
//   document.getElementById("auto-gen").innerHTML = `
//     <div class="intro-screen">
//       <div class="lds-ring">
//       <div></div>
//       <div></div>
//       <div></div>
//       <div></div>
//     </div>
//     </div>`;
// }

const getFoundPlacesHTML = (fp) => {
  // Takes an array of geo objects (for found locations), returns HTML for dropdown list
  if (fp.length === 0) return "";
  return fp.map(({ label }, i) => `<p class="choice-found-item" id="${i}">${label}</p>`).join("") || "";
};

const getSavedPlacesHTML = (sp) => {
  // Takes an array of geo objects (for saved places), returns HTML for dropdown list
  if (sp.length === 0) return "";
  return (
    "<p>Saved Places</p>" +
      sp
        .map(({ label }, i) => `<div><p class="choice-saved-item" id="${i}">${label}</p><div class="delete-button" id="${i}"><div></div></div></div>`)
        .join("") || ""
  );
};

// CONVERT 0 indexed day into a string
const dayToString = (d) => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][d - 1];

export function openPlacesList(foundPlaces, savedPlaces) {
  // Takes an array of geo objects for foundPlaces and savedPlaces and displays the popup form

  // BLUR DISPLAY
  document.getElementsByClassName("weather")[0].classList.add("weather-loading");

  // SHOW POPUP
  document.getElementsByClassName("choices")[0].classList.add("choices-show");

  // DISPLAY CHOICES FOUND OVERLAY
  document.getElementsByClassName("choices-found")[0].innerHTML = getFoundPlacesHTML(foundPlaces);

  // ADD PREVIOUSLY SAVES CHOICES (if available)
  document.getElementsByClassName("choices-saved")[0].innerHTML = getSavedPlacesHTML(savedPlaces);
}

export function closePlacesList() {
  document.getElementsByClassName("choices-found")[0].innerHTML = "";
  document.getElementsByClassName("choices-saved")[0].innerHTML = "";
  document.getElementsByClassName("choices")[0].classList.remove("choices-show");
  document.getElementsByClassName("weather")[0].classList.remove("weather-loading");
}

export function updateWeatherOnScreen(_w) {
  // TAKES AN INSTANCE OF THE WEATHER CLASS AND FORMATS DATA
  // FOR THE SCREEN
  document.getElementById("auto-gen").innerHTML = `
  <div class="loc-and-time">
        <div>
          <h2>${_w.city}</h2>
          <p><span>${_w.today}</span></p>
        </div>
        <p>Weather last updated at ${_w.time}</p>
        </div>

        <div class="weather-data">
    <img src="${_w.icon}" />
    <div>
        <h3>${_w.temp}&deg;C</h3>
        <h4>${_w.tempMin} - ${_w.tempMax}&deg;C</h4>
    </div>
    <p>${_w.description}</p>
    
    </div>
    <div class="weather-forecast">
      ${_w.forecast
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
