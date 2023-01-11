import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();
import fs from "fs";

class Busquedas {
  historial = [];
  dbPath = "./db/databse.json";

  constructor() {
    this.leerDB();
  }

  get getHistorialCapitalizado() {
    return this.historial.map((lugar) => {
      let palabras = lugar.split(" ");
      palabras = palabras.map((p) => p[0].toUpperCase() + p.slice(1));
      return palabras.join(" ");
    });

  }

  get getParamsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }

  async ciudad(lugar = "") {
    // console.log(lugar);

    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.getParamsMapbox,
      });

      const resp = await instance.get();
      return resp.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async climaLugar(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: "https://api.openweathermap.org/data/2.5/weather",
        params: {
          lat,
          lon,
          appid: process.env.OPENWEATHER_KEY,
          units: "metric",
          lang: "es",
        },
      });

      const { data } = await instance.get();
      return {
        desc: data.weather[0].description,
        min: data.main.temp_min,
        max: data.main.temp_max,
        temp: data.main.temp,
      };
    } catch (error) {
      console.log(error);
    }
  }

  agregarAlHistorial(lugar = "") {
    // TODO: prevenir duplicados

    if (!this.historial.includes(lugar)) {
      this.historial.unshift(lugar);
    }

    // grabar en DB
    this.guardarDB();
  }

  guardarDB() {
    const payload = {
      historial: this.historial,
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  leerDB() {
    if (!fs.existsSync(this.dbPath)) return;

    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const { historial } = JSON.parse(info);
    this.historial = historial;
  }
}

export default Busquedas;
