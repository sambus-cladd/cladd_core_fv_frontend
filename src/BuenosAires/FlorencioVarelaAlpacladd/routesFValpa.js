import { productividadSubRoutes } from "./Productividad/routesFVProductividad";
import { terminacionSubRoutes } from "./Terminacion/routesTerminacion";

const routes = [
  {
    name: "HOME",
    key: "Home",
    route: "/BuenosAires/FlorencioVarela/AlpacladdHome",
    target: "_self",
  },
  {
    name: "LABORATORIO",
    key: "Laboratorio",
    route: "/BuenosAires/FlorencioVarela/Laboratorio",
    target: "_self",
  },
  {
    name: "CALIDAD",
    key: "Calidad",
    children: [
      {
        name: "Stock Control de Calidad - SCC",
        key: "SCC",
        route: "http://192.168.1.233:8097/ReportsBIPortal/powerbi/Varela/SCC",
        target: "_blank",
      },
      {
        name: "Indicadores de calidad",
        key: "IndicadoresCalidad",
        route: "http://192.168.1.233:8097/ReportsBIPortal/powerbi/Calidades/CALIDAD_DIA-MES",
        target: "_blank",
      },
      {
        name: "Reporte despacho diario",
        key: "ReporteDespacho",
        route: "http://192.168.1.233:8097/ReportsBIPortal/powerbi/Varela/Reportserverdespacho",
        target: "_blank",
      },
      {
        name: "Analisis de tendencias",
        key: "Analisis",
        route: "http://192.168.1.233:8097/ReportsBIPortal/powerbi/Varela/ANALISIS",
        target: "_blank",
      },
      {
        name: "Seguimiento de ordenes de trabajo",
        key: "SeguimientoOrdenes",
        route: "http://192.168.70.54:5003/",
        target: "_blank",
      },
      {
        name: "Seguimiento ordenes de trabajo lavadero",
        key: "SeguimientoOrdenesLavadero",
        route: "http://192.168.70.54:5003/lavadero",
        target: "_blank",
      },
    ],
  },
  {
    name: "TERMINACION",
    key: "TERMINACION",
    children: terminacionSubRoutes,
  },
  {
    name: "PRODUCTIVIDAD",
    key: "Productividad",
    children: productividadSubRoutes,
  },
  {
    name: "PANEL DE EQUIPOS",
    key: "PanelEquipos",
    route: "http://192.168.0.34:5000/",
    target: "_self",
  },
];

export default routes;
