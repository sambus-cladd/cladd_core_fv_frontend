import { useReducer } from "react";
import { initialState } from "./ConstantesRegistroDatos";

function reducer(state, action) {
    switch (action.type) {
        case "SET_FIELD":
            return { ...state, [action.field]: action.value };
        case "RESET_FORM":
            return {
                ...state,
                maquina: "",
                turno: "",
                operario: "",
                orden: "",
                articulo: "",
                metros: 0,
                produccion: "",
                tiempoProduccion: 0,
                velocidadOperativa: 0,
                velocidadEstandar: 0,
                metrosTela: 0,
                rendimiento: 0,
                duracionTurno: 0,
                tiempoPlanificado: 0,
                paradas: "",
                paradasPlanificadas: 0,
                paradasNoPlanificadas: 0,
                tipoParada: "",
                disponibilidad: 0,
                rendimientoPromedio: 0,
                calidad: 0,
                referencia1: "",
                referencia2: "",
                duracion1: 0,
                duracion2: 0,

                telaTotal: 0,
                telaConObservacion: 0,
                telaOk: 0,
            };
        case "SET_MENSAJE":
            return { ...state, mensaje: action.mensaje, tipo: action.tipo, isOpen: true };
        case "SET_LOADING":
            return { ...state, loading: action.value };
        default:
            return state;
    }
}

export function UseConstantesRegistroDatos() {
    const [state, dispatch] = useReducer(reducer, initialState);
    return { state, dispatch };
}
