export const ESTADOS = ['SIN_ENTREGAR', 'CONTEO', 'CAPTURA', 'VALIDACION', 'FINALIZADO'] as const
export type EstadoLista = (typeof ESTADOS)[number]

/** A partir de este estado se permite capturar el ajuste monetario. */
export const ESTADO_MIN_AJUSTE: EstadoLista = 'VALIDACION'

export const ROLES = [
  'CONTADOR',
  'AUDITOR_PISO',
  'HABILITADOR',
  'AUXILIAR',
  'CAPTURISTA',
  'VALIDACION',
  'SOLUCIONADOR',
  'AUDITOR_EXTERNO',
] as const
export type RolIntegrante = (typeof ROLES)[number]

/** Valor de users.area que identifica al ADMIN del inventario. */
export const AREA_ADMIN = 'sistemas'

/** Minutos en un mismo estado para marcar una lista como "detenida". Se puede cambiar por query (?umbral=). */
export const UMBRAL_DETENIDA_MIN = 45
