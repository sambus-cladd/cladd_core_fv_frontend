import axios from 'axios'
import APIRoutes from "./APIRoutes";
  
let URLProduccionPorFechas    = APIRoutes[0].ProduccionPorFechas
let URLHistorialXMaquina      = APIRoutes[0].HistorialXMaquina
let URLParosMaquinasTodas     = APIRoutes[0].ParosMaquinasTodas
let URLParosXMaquinas         = APIRoutes[0].ParosXMaquinas
let URLParosPorFechas         = APIRoutes[0].ParosPorFechas
let URLGruposParosPorFechas   = APIRoutes[0].GruposParosPorFechas
let URLMaquinas               = APIRoutes[0].Maquinas
let URLEficienciaMaquinas     = APIRoutes[0].EficienciaMaquinas
let URLAlarmas                = APIRoutes[0].Alarmas

 
async function GetProduccionPorFechas(FechaIni,FechaFin)
 {
      
    const peticion = await axios.get(URLProduccionPorFechas+FechaIni+"&"+FechaFin)
    return(peticion.data)     
}
 
export {
   GetProduccionPorFechas,
}

async function GetHistorialXMaquina(FechaIni,FechaFin,Maquina)
 {
      
    const peticion = await axios.get(URLHistorialXMaquina+FechaIni+"&"+FechaFin+"&"+Maquina)
    return(peticion.data)     
}

export {
   GetHistorialXMaquina,
}

async function GetParosMaquinasTodas(FechaIni,FechaFin,Maquina)
 {
      
    const peticion = await axios.get(URLParosMaquinasTodas+FechaIni+"&"+FechaFin)
    return(peticion.data)     
}

export {
   GetParosMaquinasTodas,
}

async function GetParosXMaquinas(FechaIni,FechaFin,Maquina)
 {
      
    const peticion = await axios.get(URLParosXMaquinas+FechaIni+"&"+FechaFin+"&"+Maquina)
    return(peticion.data)     
}

export {
   GetParosXMaquinas,
}

async function GetParosPorFechas(FechaIni,FechaFin)
 {
      
    const peticion = await axios.get(URLParosPorFechas+FechaIni+"&"+FechaFin)
    return(peticion.data)     
}
 
export {
   GetParosPorFechas,
}

async function GetGruposParosPorFechas(FechaIni,FechaFin,Maquina)
 {
      
    const peticion = await axios.get(URLGruposParosPorFechas+FechaIni+"&"+FechaFin+"&"+Maquina)
    return(peticion.data)     
}
 
export {
   GetGruposParosPorFechas,
}

async function GetMaquinas()
 {
      
    const peticion = await axios.get(URLMaquinas)
    return(peticion.data)     
}
 
export {
   GetMaquinas,
}

async function GetEficienciaMaquinas(FechaIni,FechaFin,Maquina)
 {
      
    const peticion = await axios.get(URLEficienciaMaquinas+FechaIni+"&"+FechaFin+"&"+Maquina)
    return(peticion.data)     
}
 
export {
   GetEficienciaMaquinas,
}

async function GetAlarmas()
 {
      
    const peticion = await axios.get(URLAlarmas)
    return(peticion.data)     
}
 
export {
   GetAlarmas,
}