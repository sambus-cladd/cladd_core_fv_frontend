// === ConstantesOEE.js ===

// Estado inicial de filas de tiempos productivos
export const tiemposProductivosInicial = Array.from({ length: 6 }, () => ({
  articulo: "",
  metros: "",
  tiempoProd: "",
  vOperativa: 0,
  vEstandar: "",
  mProyectados: "",
  rendimiento: 0,
}));

// Estado inicial de filas de tiempos improductivos
export const tiemposImproductivosInicial = Array.from({ length: 6 }, () => ({
  tipo: "",
  referencia: "",
  duracion: "",
  
}));

// Estado inicial de los datos generales OEE
export const oeeInicial = {
  duracionTurno: "",
  paradasPlanificadas: "",
  paradasNoPlanificadas: "",
  tPlanificado: "",
  disponibilidad: 0,
  rendimientoPromedio: 0,
  calidad: 0,
  oee: 0,
};

// Estado inicial de calidad
export const calidadInicial = {
  total: "",
  obs: "",
  ok: "",
};

// Opciones de menu desplegable
export const MAQUINISTAS = ["Juan Perez", "Maria Lopez", "Carlos Diaz"];
export const TURNOS = ["PAR", "IMPAR", "NOCHE"];
export const SUPERVISORES = ["Gonzalez", "Fernandez", "Ramirez"];
export const MAQUINAS = ["010", "108", "123", "124", "146", "160", "YAMUNA"]
export const PARADAS = ["PLANIFICADAS", "NO PLANIFICADAS"]

// Columnas de la tabla de tiempos productivos
export const columnasTiemposProductivos = [
  { id: "articulo", label: "Articulo" },
  { id: "metros", label: "Metros" },
  { id: "tiempoProd", label: "Tiempo prod. (min)" },
  { id: "vOperativa", label: "V. Operativa (m/min)" },
  { id: "vEstandar", label: "V. Estandar (m/min)" },
  { id: "mProyectados", label: "Metros Proyec." },
  { id: "rendimiento", label: "Rendimiento" },
];
// Columnas de la tabla de tiempos improductivos
export const columnasTiemposImproductivos = [
  { id: "tipoParada", label: "Tipo" },
  { id: "referencia", label: "Referencia" },
  { id: "duracion", label: "Duracion (min)" }
];
// Columnas de la tabla de calculo OEE
export const columnasOEE = [
  { id: "duracionTurno", label: "Duracion turno (min)" },
  { id: "paradasPlan", label: "Paradas planificadas (min)" },
  { id: "paradasNoPlan", label: "Paradas NO planificadas (min)" },
  { id: "tiempoPlan", label: "Tiempo planificado (min)" },
  { id: "disponibilidad", label: "Disponibilidad (%)" },
  { id: "rendimientoProm", label: "Rendimiento promedio (%)" },
  { id: "calidad", label: "Calidad (%)" },
];
// Columnas de la tabla Calidad
export const columnasCalidad = [
  { id: "telaTotal", label: "Tela total" },
  { id: "telaObs", label: "Tela con observaciones" },
  { id: "telaOk", label: "Tela OK" },
];
