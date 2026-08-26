export const productividadSubRoutes = [
  {
    name: "PCP",
    key: "pcp",
    route: "/BuenosAires/FlorencioVarela/Productividad/PCP",
    target: "_self",
  },
  {
    name: "Stock de rollos",
    key: "StockDeRollos",
    route: "/BuenosAires/FlorencioVarela/Productividad/StockDeRollos",
    target: "_self",
  },
  {
    name: "Inventario PDG",
    key: "InventarioTelaCruda",
    route: "http://192.168.40.95:4005/LaRioja/Alpacladd/Productividad/InventarioTelaCruda",
    target: "_blank",
  },
  // Ocultos a propósito (skill FV Alpacladd redesign)
  // {
  //   name: "Stock de químicos",
  //   key: "StockDeQuimicos",
  //   route: "/BuenosAires/FlorencioVarela/Productividad/StockDeQuimicos",
  //   target: "_self",
  // },
  {
    name: "Agregar rollo",
    key: "AgregarRolloFV",
    route: "/BuenosAires/FlorencioVarela/Productividad/AgregarRolloFV",
    target: "_self",
  },
  // {
  //   name: "Actualizar químicos",
  //   key: "ActualizarQuimicoFV",
  //   route: "/BuenosAires/FlorencioVarela/Productividad/ActualizarQuimicoFV",
  //   target: "_self",
  // },
  {
    name: "Producción",
    key: "Produccion",
    route: "/BuenosAires/FlorencioVarela/Productividad/Produccion",
    target: "_self",
  },
  {
    name: "Subproducto",
    key: "Subproducto",
    route: "/BuenosAires/FlorencioVarela/Productividad/Subproducto",
    target: "_self",
  },
  {
    name: "Reportes",
    key: "ReportesProductividad",
    route: "/BuenosAires/FlorencioVarela/Productividad/ReportesProductividad",
    target: "_self",
  },
  {
    name: "Monitoreo máquinas",
    key: "MonitoreoMaq",
    route: "/BuenosAires/FlorencioVarelaAlpacladd/Monitoreo/MonitoreoMaquinas",
    target: "_self",
  },
];

const routes = [
  {
    name: "HOME",
    key: "Home",
    route: "/BuenosAires/FlorencioVarela/AlpacladdHome",
    target: "_self",
  },
  ...productividadSubRoutes,
];

export default routes;
