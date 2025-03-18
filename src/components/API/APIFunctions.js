import axios from "axios";
import APIRoutes from "./APIRoutes";

let APIURLTablaArticulos = APIRoutes[0].TablaArticulos;
let APIURLTablaDetalles = APIRoutes[0].TablaDetalles;
let APIURLCargaArticulos = APIRoutes[0].CargarArticulos;
let URLTablaArticulosDetalles = APIRoutes[0].TablaArticulosDetalles;

export async function GetTABLAARTICULOS(rango) {
  const peticion = await axios.get(APIURLTablaArticulos, rango);
  return peticion.data;
}

export async function GetTABLADETALLES(rango) {
  const peticion = await axios.get(APIURLTablaDetalles + rango);
  return peticion.data;
}

export async function PutREGISTRARARTICULO(rango) {
  const peticion = await axios.put(APIURLCargaArticulos, rango);
  return peticion.data;
}

export async function getTablaArticulosDetalles(data) {
  const peticion = await axios.get(URLTablaArticulosDetalles, data);
  return peticion.data;
}
