/**
 * Solo el ADMIN modifica datos, así que el historial no necesita
 * identificar al usuario. Se guarda un valor fijo en usuario_id
 * (columna NOT NULL sin FK). Si después se agrega autenticación,
 * solo se cambia este valor por el id del usuario logueado.
 */
export const USUARIO_ADMIN_ID = 0
