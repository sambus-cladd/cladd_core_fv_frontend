export const terminacionSubRoutes = [
  {
    name: "Registrar muestra",
    key: "REGISTRARMUESTRA",
    route: "/BuenosAires/FlorencioVarela/Terminacion/RegistrarMuestra",
    target: "_self",
  },
  {
    name: "Stock calidad",
    key: "STOCKCALIDAD",
    route: "/BuenosAires/FlorencioVarela/Terminacion/StockCalidad",
    target: "_self",
  },
  {
    name: "Etiqueta",
    key: "ETIQUETA",
    route: "/BuenosAires/FlorencioVarela/Terminacion/Etiqueta",
    target: "_self",
  },
  {
    name: "Ficha técnica",
    key: "FICHATECNICA",
    route: "/BuenosAires/FlorencioVarela/Terminacion/FichaTecnica",
    target: "_self",
  },
  {
    name: "Reportes",
    key: "REPORTES",
    route: "/BuenosAires/FlorencioVarela/Terminacion/Reportes",
    target: "_self",
  },
  {
    name: "Reimprimir etiquetas",
    key: "REIMPRIMIR ETIQUETAS",
    route: "/BuenosAires/FlorencioVarelaAlpacladd/Terminacion/ReimpresionEtiquetas",
    target: "_self",
  },
  {
    name: "Rechazos",
    key: "REGISTRO DE RECHAZOS",
    route: "/BuenosAires/FlorencioVarelaAlpacladd/Terminacion/RechazosRegistro",
    target: "_self",
  },
];

/** Rutas para el HeaderYFooter interno del módulo (incluye HOME Alpacladd). */
const routes = [
  {
    name: "HOME",
    key: "Home",
    route: "/BuenosAires/FlorencioVarela/AlpacladdHome",
    target: "_self",
  },
  ...terminacionSubRoutes,
];

export default routes;
