
import {Home} from "../../src/page/Home";
import BuenosAires from './BuenosAires' // 
 
const routes = [
  {
    name: "HOME ",
    key: "Home",
    route: "/Home",
    target:"_self",
    component: <Home/>,
  },
  {
    name: "CLADD SAN MARTIN",
    key: "SanMartin",
    // icon: <WarehouseIcon fontSize="small" />,//Hallscrenn</Icon>,
    // route: "/TierradelFuego",
    target:"_self",
    // component: <HallscreenNew />,
  },
  {
    name: "ALPACLADD FLORENCIO VARELA ",
    key: "AlpacladdFlorencioVarela",
    route: "/BuenosAires/FlorencioVarela/AlpacladdHome",
    target:"_self",
  },
];
 

export default routes; 