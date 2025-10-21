
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

const ActualizarDatosReales = APIURL + "Gant/ActualizarDatosReales";
const GuardarEstadoOrden    = APIURL + "Gant/GuardarEstadoOrden";
const EstadoOrden           = APIURL + "Gant/EstadoOrden/";
const SecuenciaRollo        = APIURL + "Gant/SecuenciaRollo/";
const DatosOrdenes          = APIURL + "Gant/DatosOrdenes/";
const NumOrdenes            = APIURL + "Gant/NumOrdenes/";
const RolloOrdenes          = APIURL + "Gant/RolloOrdenes/";
const OrdenesGantt          = APIURL + "Gant/OrdenesGantt";
const ValidarLegajo         = APIURL + "Gant/ValidarLegajo/";
const AsignarResponsable    = APIURL + "Gant/AsignarResponsable/";
const Responsables          = APIURL + "Gant/Responsables/";

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

        ActualizarDatosReales : ActualizarDatosReales, 
        GuardarEstadoOrden : GuardarEstadoOrden,
        EstadoOrden : EstadoOrden,
        DatosOrdenes : DatosOrdenes,
        NumOrdenes : NumOrdenes,
        RolloOrdenes : RolloOrdenes,
        OrdenesGantt : OrdenesGantt,
        ValidarLegajo : ValidarLegajo,
        AsignarResponsable : AsignarResponsable,
        Responsables : Responsables,
        SecuenciaRollo : SecuenciaRollo,
    }
]

export default APIRoutes;