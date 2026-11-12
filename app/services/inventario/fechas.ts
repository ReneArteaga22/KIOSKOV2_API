import { DateTime } from 'luxon'

/**
 * Todas las fechas de negocio las genera el backend (no la BD),
 * para que local (MariaDB) y producción (MySQL) se comporten igual.
 */
export const ahora = () => DateTime.now()

/** Formato DATETIME para updates hechos con query builder. */
export const aSql = (d: DateTime) => d.toFormat('yyyy-LL-dd HH:mm:ss')

export const minutosEntre = (inicio: DateTime, fin: DateTime) =>
  Math.max(0, Math.round(fin.diff(inicio, 'minutes').minutes))
