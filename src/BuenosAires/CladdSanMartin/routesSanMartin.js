
/* 
==================================================================================================================
                  RUTAS PRIMARIAS
==================================================================================================================

Para agregar una nueva ruta, puede seguir las rutas existentes en la matriz de rutas.
  1. La clave `type` con el valor `collapse` se usa para una ruta.
  2. La tecla `tipo` con el valor `título` se utiliza para un título dentro de Sidenav.
  3. La tecla `tipo` con el valor `divider` se usa para dividir entre elementos de Sidenav.
  4. La tecla `nombre` se utiliza para el nombre de la ruta en Sidenav.
  5. La tecla `key` se utiliza para la clave de la ruta (te ayudará con la clave de apoyo dentro de un bucle).
  6. La tecla `icon` se utiliza para el icono de la ruta en el Sidenav, hay que añadir un nodo.
  7. La tecla `collapse` se utiliza para crear un elemento plegable en el Sidenav que tiene otras rutas
  inside (rutas anidadas), debe pasar las rutas anidadas dentro de una matriz como un valor para la clave `collapse`.
  8. La tecla `ruta` se usa para almacenar la ubicación de la ruta que se usa para el enrutador de reacción.
  9. La clave `href` se usa para almacenar la ubicación de los enlaces externos.
  10. La tecla 'título' es solo para el elemento con el tipo de 'título' y se usa para el texto del título en Sidenav.
  10. La clave `componente` se utiliza para almacenar el componente de su ruta.
*/

// Material Dashboard 2 React layouts

// import Dashboard from "layouts/dashboard";
// import Camarascreen from "layouts/Camaras";
// import Efficiencyscrean from "layouts/Efficiencyscrean";
// import HallscreenNew from "layouts/Hallscreen";

// // @mui icons
// import Icon from "@mui/material/Icon";
// import TrendingUpIcon from '@mui/icons-material/TrendingUp'; 
// import WarehouseIcon from '@mui/icons-material/Warehouse'; 
// import InsertChartIcon from '@mui/icons-material/InsertChart';
// import CameraOutdoorIcon from '@mui/icons-material/CameraOutdoor';
// import ReporteMensual from "layouts/Reportes/Mensual"

import {Home} from "../../page/Home";

const routes = [
  {
    name: "HOME |",
    key: "Home",
    // icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/Home",
    target:"_self",
    component: <Home/>,
  },
  {
    name: "Tintoreria Salon |",
    key: "TintoreriaSalon",
    // icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/BuenosAires/CladdSanMartin/TintoreriaSalon",
    target:"_blank",
    // component: <CladdSanMartin/>,
  },
  // {
  //   name: "Tintoreria Alarmas |",
  //   key: "TintoreriaAlarmas",
  //   route: "/BuenosAires/CladdSanMartin/Tintoreria/TintoreriaAlarmas",
  //   target:"_blank",
  //   // component: <HomeEnod/>,
  // },
  {
    name: "Tintoreria Reportes |",
    key: "TintoreriaReportes",
    route: "/BuenosAires/CladdSanMartin/Tintoreria/TintoreriaReportes",
    target:"_blank",
    // component: <HomeEnod/>,
  },
];
 

export default routes; 