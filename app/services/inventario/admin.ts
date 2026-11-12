import { AREA_ADMIN } from './constantes.js'

export function esAdminInventario(user: { area?: string | null }): boolean {
  return (user.area ?? '').trim().toLowerCase() === AREA_ADMIN
}
