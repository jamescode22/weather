export class GeoDataModel {
  constructor() {
    this.foundPlaces = [];
    this.savedPlaces = JSON.parse(localStorage.getItem("savedplaces")) || [];
  }

  _storeSavedPlaces(savedPlaces) {
    localStorage.setItem("savedplaces", JSON.stringify(savedPlaces));
  }

  bindGeoDataChanged(callback) {
    this.onGeoDataChanged = callback;
  }

  updateFoundPlacesData(geodata) {
    // Takes data direct from the geo coding API and converts to
    // local storage format (a "place" object)
    this.foundPlaces = geodata.map((item) => {
      return {
        name: item.name,
        latitude: item.lat,
        longitude: item.lon,
        label: `${item.name}${item.state ? ", " + item.state : ""}${item.country ? ", " + item.country : ""}`,
      };
    });

    this.onGeoDataChanged(this.foundPlaces, this.savedPlaces);
  }

  getPlaceFromClassAndID(className, id) {
    // returns a place object based on the classname and id
    return className === "choice-found-item" ? this.foundPlaces[id] : this.savedPlaces[id];
  }

  addToSavedPlaces(place) {
    if (this.savedPlaces.find((fPlace) => fPlace.label === place.label)) return;
    this.savedPlaces.push(place);
    this._storeSavedPlaces(this.savedPlaces);
    this.onGeoDataChanged(this.foundPlaces, this.savedPlaces);
  }

  deleteFromSavedPlaces(id) {
    this.savedPlaces.splice(id, 1);
    this._storeSavedPlaces(this.savedPlaces);
    this.onGeoDataChanged(this.foundPlaces, this.savedPlaces);
  }
}
