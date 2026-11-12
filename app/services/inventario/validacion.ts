import { InvError } from '#exceptions/inv_error'

const vacio = (v: unknown) => v === undefined || v === null || String(v).trim() === ''

export function texto(v: unknown, campo: string, max: number, requerido = true): string | null {
  if (vacio(v)) {
    if (requerido) throw new InvError(`${campo} es requerido`)
    return null
  }
  if (typeof v !== 'string' && typeof v !== 'number') throw new InvError(`${campo} no es válido`)
  const s = String(v).trim()
  if (s.length > max) throw new InvError(`${campo} excede ${max} caracteres`)
  return s
}

export function id(v: unknown, campo: string, requerido = true): number | null {
  if (vacio(v)) {
    if (requerido) throw new InvError(`${campo} es requerido`)
    return null
  }
  const n = Number(v)
  if (!Number.isInteger(n) || n <= 0) throw new InvError(`${campo} no es válido`)
  return n
}

export function ids(v: unknown, campo: string): number[] {
  if (!Array.isArray(v) || v.length === 0) throw new InvError(`${campo} debe ser una lista con al menos un elemento`)
  return [...new Set(v.map((x) => id(x, campo) as number))]
}

/** Devuelve el valor absoluto con 2 decimales. El signo lo pone el servicio. */
export function monto(v: unknown, campo: string): number {
  const n = Number(v)
  if (vacio(v) || !Number.isFinite(n)) throw new InvError(`${campo} debe ser numérico`)
  if (Math.abs(n) > 999_999_999_999.99) throw new InvError(`${campo} fuera de rango`)
  return Math.round(Math.abs(n) * 100) / 100
}

export function opcion<T extends string>(v: unknown, campo: string, valores: readonly T[]): T {
  const s = String(v ?? '').trim().toUpperCase()
  if (!valores.includes(s as T)) throw new InvError(`${campo} debe ser uno de: ${valores.join(', ')}`)
  return s as T
}

export function booleano(v: unknown, porDefecto: boolean): boolean {
  if (v === undefined || v === null) return porDefecto
  return v === true || v === 1 || v === '1' || v === 'true'
}
