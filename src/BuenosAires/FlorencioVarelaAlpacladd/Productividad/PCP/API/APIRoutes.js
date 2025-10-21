
const APIURL = "http://192.168.0.18:4300/";

const CargaGantFV       = APIURL+"AlpacladdFVProductividadREGISTROGANT"
const DatosGantFV       = APIURL+"AlpacladdFVProductividadDATOSGANT"
const TablaMaquinas     = APIURL+"AlpacladdFVProductividadTABLAMAQUINAS"
const TablaProcesos     = APIURL+"AlpacladdFVProductividadTABLAPROCESOS"
const TablaCodMaquinas  = APIURL+'AlpacladdFVProductividadTABLACODMAQUINAS'
const TablaColores      = APIURL+'AlpacladdFVProductividadTABLACOLORES'
const HistoricoGantt    = APIURL+'AlpacladdFVProductividadHISTORICOGANTT'
const MetrosxArticulo   = APIURL+'AlpacladdFVProductividadMetrosXArticulos'
const ProduccionxOrden  = APIURL+'AlpacladdFVProductividadProdxOrden/'
const ModificacionFV    = APIURL+'AlpacladdFVProductividadMODIFICACIONGANT'
const EliminarOrdenPcp  = APIURL+'AlpacladdFVProductividadDeleteOrdenPcp/'

const APIRoutes = [
    {
        CargaGantFV      :   CargaGantFV,
        DatosGantFV      :   DatosGantFV,
        TablaMaquinas    :   TablaMaquinas,
        TablaProcesos    :   TablaProcesos,
        TablaCodMaquinas :   TablaCodMaquinas,
        TablaColores     :   TablaColores,
        HistoricoGantt   :   HistoricoGantt,
        MetrosxArticulo  :   MetrosxArticulo,
        ProduccionxOrden :   ProduccionxOrden,
        ModificacionFV   :   ModificacionFV,
        EliminarOrdenPcp :   EliminarOrdenPcp,
    }
]

export default APIRoutes;