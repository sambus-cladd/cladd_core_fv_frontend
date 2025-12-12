import axios from 'axios'
import APIRoutes from "./APIRoutes";

const URLCargagantFV    = APIRoutes[0].CargaGantFV
const URLCargaGantReprocesoFV    = APIRoutes[0].CargaGantReprocesoFV
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

async function PutRegistroGantReprocesoFV(data) {
    let respuesta = await axios.put(URLCargaGantReprocesoFV, data)
    return (respuesta);
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

const actualizarDatosReales = async ({ IdOrden, MetrosReal, HoraInicioReal, HoraFinReal, FechaRegistroReal,HorasTotalReal }) => {
    try {
        const response = await axios.put('http://192.168.0.18:4300/Gant/ActualizarDatosReales', {
            IdOrden,
            MetrosReal,
            HoraInicioReal,
            HoraFinReal,
            FechaRegistroReal,
            HorasTotalReal
        });
        return response.data;
    } catch (error) {
        console.error("Error en actualizarDatosReales:", error);
        throw error;
    }
};

const guardarEstadoOrden = async ({ IdOrden, NumeroOrden, EstadoOrden, HoraInicioReal, 
    HoraFinReal, MetrosTotales, MetrosPorRollo, Responsables }) => {
    try {
        const response = await axios.put('http://192.168.0.18:4300/Gant/GuardarEstadoOrden', {
            IdOrden,
            NumeroOrden,
            EstadoOrden,
            HoraInicioReal,
            HoraFinReal,
            MetrosTotales,
            MetrosPorRollo,
            Responsables,
        });
        return response.data;
    } catch (error) {
        console.error("Error en guardarEstadoOrden:", error);
        throw error;
    }
};
const getEstadoOrden = async (idOrden) => {
  try {
    const response = await axios.get(`http://192.168.0.18:4300/Gant/EstadoOrden/${idOrden}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { success: false, data: null };
    } else {
      console.error("Error en getEstadoOrden:", error);
      throw error;
    }
  }
};


const getSecuenciaRollo = async (rollo) => {
    try {
        const response = await axios.get(`http://192.168.0.18:4300/Gant/SecuenciaRollo/${rollo}`);
        return response.data;
    } 
    catch (error) {
        console.error("Error en getEstadoOrden:", error);
        throw error;
    }
};

const getDatosOrdenes = async (idOrden) => {
  try {
    const response = await axios.get(`http://192.168.0.18:4300/Gant/DatosOrdenes/${idOrden}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { success: false, data: null };
    } else {
      console.error("Error en getDatosOrdenes:", error);
      throw error;
    }
  }
};


const getNumeroOrdenes = async (numero_orden) => {
    try {
        const response = await axios.get(`http://192.168.0.18:4300/Gant/NumOrdenes/${numero_orden}`);
        return response.data;
    } 
    catch (error) {
        console.error("Error en getDatosOrdenes:", error);
        throw error;
    }
};

const getOrdenPorRollo = async (rollo) => {
    try {
        const response = await axios.get(`http://192.168.0.18:4300/Gant/RolloOrdenes/${rollo}`);
        return response.data;
    } 
    catch (error) {
        console.error("Error en getDatosOrdenes:", error);
        throw error;
    }
};
const getOrdenesGantt = async () => {
    try {
        const response = await axios.get(`http://192.168.0.18:4300/Gant/OrdenesGantt`);
        return response.data;
    } 
    catch (error) {
        console.error("Error en getDatosOrdenesGantt:", error);
        throw error;
    }
};
const validarLegajo = async (legajo) => {
    try {
        const response = await axios.get(`http://192.168.0.18:4300/Gant/ValidarLegajo/${legajo}`);
        console.log("Respuesta validarLegajo:", response.data);
        return response.data;
        
    } 
    catch (error) {
        console.error("Error en validar legajo:", error);
        throw error;
    }
};
const asignarResponsable = async (NumeroOrden) => {
    try {
        const response = await axios.get(`http://192.168.0.18:4300/Gant/AsignarResponsable/${NumeroOrden}`);
        console.log("Respuesta responsaable:", response.data);
        return response.data;
        
    } 
    catch (error) {
        console.error("Error en asignar responsable:", error);
        throw error;
    }
};
const getResponsables = async (idOrden) => {
    try {
        const response = await axios.get(`http://192.168.0.18:4300/Gant/Responsables/${idOrden}`);
        console.log("Respuesta responsaable:", response.data);
        return response.data;
        
    } 
    catch (error) {
        console.error("Error en asignar responsable:", error);
        throw error;
    }
};

export {
    PutRegistroGantFV,
    PutRegistroGantReprocesoFV,
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
    actualizarDatosReales,
    guardarEstadoOrden,
    getEstadoOrden,
    getSecuenciaRollo,
    getDatosOrdenes,
    getNumeroOrdenes,
    getOrdenPorRollo,
    getOrdenesGantt,
    validarLegajo,
    asignarResponsable,
    getResponsables,
}