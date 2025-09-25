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
