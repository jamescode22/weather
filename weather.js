import { AppController } from "./modules/AppController.js";
import { WeatherModel } from "./modules/WeatherModel.js";
import { GeoDataModel } from "./modules/GeoDataModel.js";
import { WeatherView } from "./modules/WeatherView.js";

const app = new AppController(new WeatherModel(), new GeoDataModel(), new WeatherView());
