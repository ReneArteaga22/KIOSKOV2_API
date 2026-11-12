/**
 * Error de regla de negocio del inventario.
 * Los controllers lo traducen a una respuesta HTTP con su status.
 */
export class InvError extends Error {
  constructor(
    message: string,
    public status: number = 422
  ) {
    super(message)
    this.name = 'InvError'
  }
}
