import colors from "colors";
import inquirerMenu, {
  leerImput,
  listarLugares,
  pausa,
} from "./helpers/inquirer.js";
import Busquedas from "./models/busquedas.js";

const main = async () => {
  const busquedas = new Busquedas();
  let opt;

  do {
    opt = await inquirerMenu();
    console.log({ opt });

    switch (opt) {
      case 1:
        const termino = await leerImput("Ciudad");
        const lugares = await busquedas.ciudad(termino);
        const id = await listarLugares(lugares);

        if (id === "0") continue;

        const lugarSeleccionado = lugares.find((lugar) => lugar.id === id);
        busquedas.agregarAlHistorial(lugarSeleccionado.nombre);
        const { nombre, lng, lat } = lugarSeleccionado;
        const { desc, temp, min, max } = await busquedas.climaLugar(lat, lng);

        console.log("\nInformacion de la ciudad\n".green);
        console.log("Ciudad: ", nombre);
        console.log("Lat:", lat);
        console.log("Lng: ", lng);
        console.log("Temperatura: ", temp);
        console.log("Temperatura min: ", min);
        console.log("Temperatura max: ", max);
        console.log("Como esta el clima: ", desc);
        break;
      case 2:
        busquedas.getHistorialCapitalizado.forEach((lugar, i)=>{
            const indice = `${i + 1}`.green;
            console.log(`${indice} ${lugar}`)
        })
        break;
    }

    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();
