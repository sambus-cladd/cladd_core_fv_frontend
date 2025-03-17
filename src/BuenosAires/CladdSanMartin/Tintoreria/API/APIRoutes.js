
// API Tejeduria Plana TOYOTA

//Direccion de la API
// const APIURL="http://192.168.40.87:3004/";   // Notebook Mariano
// const APIURL="http://192.168.40.121:3004/";   // Notebook Mariano en su casa con VPN
//const APIURL="http://192.168.40.68:3009/";    //Notebook Carlos
const APIURL="http://192.168.40.95:4500/"; //Server
 
//Buscar Rollo por Partida y Secuencia  Datos del Toyota
const ProduccionPorFechas             =APIURL+"infotintPRODUCCION/";
const HistorialXMaquina               =APIURL+"infotintPRODUCCIONXMAQUINA/";
const ParosMaquinasTodas              =APIURL+"infotintPAROSXGRUPOMAQUINAS/";
const ParosXMaquinas                  =APIURL+"infotintPAROSXMAQUINAS/";
const ParosPorFechas                  =APIURL+"infotintPAROS/";
const GruposParosPorFechas            =APIURL+"infotintGRUPOSPAROS/";
const Maquinas                        =APIURL+"infotintMAQUINAS/";
const EficienciaMaquinas              =APIURL+"infotintEFICIENCIA/";
const Alarmas                         =APIURL+"infotintALARMAS/";

 
const APIRoutes = [ 
    {
        ProduccionPorFechas           :     ProduccionPorFechas,
        HistorialXMaquina             :     HistorialXMaquina,
        ParosMaquinasTodas            :     ParosMaquinasTodas,
        ParosXMaquinas                :     ParosXMaquinas,
        ParosPorFechas                :     ParosPorFechas,
        GruposParosPorFechas          :     GruposParosPorFechas,
        Maquinas                      :     Maquinas,
        EficienciaMaquinas            :     EficienciaMaquinas,
        Alarmas                       :     Alarmas,

    },

  ];
  export default APIRoutes;