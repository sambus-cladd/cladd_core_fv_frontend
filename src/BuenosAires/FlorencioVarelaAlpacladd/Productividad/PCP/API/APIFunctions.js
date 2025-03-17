import axios from 'axios'
import APIRoutes from "./APIRoutes";

const URLCargagantFV    = APIRoutes[0].CargaGantFV
const URLDatosgantFV    = APIRoutes[0].DatosGantFV
const URLTablamaquina   = APIRoutes[0].TablaMaquinas
const URLTablaprocesos  = APIRoutes[0].TablaProcesos
const URLTablacodmaquinas = APIRoutes[0].TablaCodMaquinas
const URLTablacolores     = APIRoutes[0].TablaColores
const URLHistoricogantt   = APIRoutes[0].HistoricoGantt
const URLMetrosxarticulo  = APIRoutes[0].MetrosxArticulo
const URLProdxorden       = APIRoutes[0].ProduccionxOrden
const URLModificacionFV   = APIRoutes[0].ModificacionFV
const URLEliminarOrdenPcp = APIRoutes[0].EliminarOrdenPcp
async function PutRegistroGantFV(data) {
    const peticion = await axios.put(URLCargagantFV,data)
    return(peticion.data) 
}

async function PutModificacionGantFV(data) {
    const peticion = await axios.put(URLModificacionFV,data)
    return(peticion.data) 
}

/*******************************************************************/

async function GetDatosGantFV(data) {
    const peticion = await axios.get(URLDatosgantFV,data)
    return(peticion.data)
}

async function GetTABLAMAQUINAS(data) {
    const peticion = await axios.get(URLTablamaquina,data)
    return(peticion.data)
}

async function GetTABLAPROCESOS(data) {
    const peticion = await axios.get(URLTablaprocesos,data)
    return(peticion.data)
}

async function GetTABLACODMAQUINAS(data) {
    const peticion = await axios.get(URLTablacodmaquinas,data)
    return(peticion.data)
}

async function GetTABLACOLORES(data) {
    const peticion = await axios.get(URLTablacolores,data)
    return(peticion.data)
}

async function GetHISTORICOGANTT(data) {
    const peticion = await axios.get(URLHistoricogantt,data)
    return(peticion.data)
}

async function GetMetrosxArticulo(data)
{
    const peticion = await axios.get(URLMetrosxarticulo,data)
    return(peticion.data)
}

async function GetProdxOrden(data){
    const peticion = await axios.get(URLProdxorden+data)
    return(peticion.data)
}

async function DeleteOrdenPcp(id){
    const peticion = await axios.delete(URLEliminarOrdenPcp+id)
    return(peticion.data)
}

export {
    PutRegistroGantFV,
    PutModificacionGantFV,
    GetDatosGantFV,
    GetTABLAMAQUINAS,
    GetTABLAPROCESOS,
    GetTABLACODMAQUINAS,
    GetTABLACOLORES,
    GetHISTORICOGANTT,
    GetMetrosxArticulo,
    GetProdxOrden,
    DeleteOrdenPcp,
}