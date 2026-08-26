const _base = import.meta.env.VITE_API_FV_BASE || "http://192.168.0.18:4300";
const APIURL = _base.endsWith("/") ? _base : `${_base}/`;

const CargaGantFV       = APIURL + "AlpacladdFVProductividadREGISTROGANT"
const CargaGantReprocesoFV = APIURL + "Gant/RegistroGantReproceso"
const DatosGantFV       = APIURL + "AlpacladdFVProductividadDATOSGANT"
const TablaMaquinas     = APIURL + "AlpacladdFVProductividadTABLAMAQUINAS"
const TablaProcesos     = APIURL + "AlpacladdFVProductividadTABLAPROCESOS"
const TablaCodMaquinas  = APIURL + 'AlpacladdFVProductividadTABLACODMAQUINAS'
const TablaColores      = APIURL + 'AlpacladdFVProductividadTABLACOLORES'
const HistoricoGantt    = APIURL + 'AlpacladdFVProductividadHISTORICOGANTT'
const MetrosxArticulo   = APIURL + 'AlpacladdFVProductividadMetrosXArticulos'
const ProduccionxOrden  = APIURL + 'AlpacladdFVProductividadProdxOrden/'
const ModificacionFV    = APIURL + 'AlpacladdFVProductividadMODIFICACIONGANT'
const EliminarOrdenPcp  = APIURL + 'AlpacladdFVProductividadDeleteOrdenPcp/'

const APIRoutes = [
    {
        CargaGantFV,
        CargaGantReprocesoFV,
        DatosGantFV,
        TablaMaquinas,
        TablaProcesos,
        TablaCodMaquinas,
        TablaColores,
        HistoricoGantt,
        MetrosxArticulo,
        ProduccionxOrden,
        ModificacionFV,
        EliminarOrdenPcp,
    }
]

export default APIRoutes;
