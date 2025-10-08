// Listas fijas
export const maquinasDisponibles = [
  "010", "108", "123", "124", "146", "160", "Yamuna"
];

export const turnosDisponibles = [
  "Par", "Impar", "Noche"
];

export const paradaTipo = [
  "Planificada", "NO Planificada"
];
export const columnasRegistro = [
  { id: "orden", label: "Orden" },
  { id: "articulo", label: "Articulo" },
  { id: "maquina", label: "Maquina" },
  { id: "maquina_proceso", label: "Maquina Proceso" },
  { id: "metros_real", label: "Metros", formato: (v) => (
    v !== null && v !== undefined ? Math.round(v) : "-")
  },
  {
    id: "fecha_registro_real", label: "Fecha Registro",
    formato: (v) => {
      const fecha = new Date(v);
      return fecha.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  },
];

// Estado inicial para el reducer
export const initialState = {
  mensaje: "",
  isOpen: false,
  tipo: "success",
  loading: false,

  maquina: "",
  turno: "",
  operario: "",
  orden: "",
  articulo: "",

  metros: "",
  produccion: "",
  tiempoProduccion: "",
  velocidadOperativa: "",
  velocidadEstandar: "",
  metrosTela: "",
  rendimiento: "",

  duracionTurno: "",
  tiempoPlanificado: "",

  paradas: "",
  paradasPlanificadas: "",
  paradasNoPlanificadas: "",
  tipoParada: "", // hace referencia a paradaTipo

  disponibilidad: "",
  rendimientoPromedio: "",
  calidad: "",

  referencia1: "",
  referencia2: "",
  duracion1: "",
  duracion2: "",

  telaTotal: "",
  telaConObservacion: "",
  telaOk: "",
};
