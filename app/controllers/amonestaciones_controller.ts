import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon' // <-- Agrega esta línea
import Amonestacion from '#models/amonestacion'
import AmonestacionValidator from '#validators/amonestacion'
import db from '@adonisjs/lucid/services/db'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export default class AmonestacionesController {

  // ── Helper privado para compilar y validar ───────────────────────────────
  private async validate(data: unknown) {
    const v = new AmonestacionValidator()
    const compiled = vine.compile(v.schema)
    return compiled.validate(data, {
      messagesProvider: new SimpleMessagesProvider(v.messages),
    })
  }
  // GET /api/amonestaciones
  public async index({ request, response }: HttpContext) {
    const { q, planta, year } = request.qs()
    const targetYear = Number(year) || new Date().getFullYear()

    const query = Amonestacion.query().where('year', targetYear)

    if (planta) query.where('planta', planta)

    if (q) {
      const term = `%${q}%`
      query.where((sub) => {
        sub
          // Cambiamos .whereLike() por .where('columna', 'like', valor)
          .where('nombre', 'like', term)
          .orWhere('no_empleado', 'like', term)
          .orWhere('motivo', 'like', term)
          .orWhere('departamento', 'like', term)
          .orWhere('reporta', 'like', term)
      })
    }

    const records = await query.orderBy('ts', 'desc')
    return response.ok(records)
  }

  // GET /api/amonestaciones/kpis
  public async kpis({ request, response }: HttpContext) {
    const year = Number(request.qs().year) || new Date().getFullYear()

    const rows = await db
      .from('amonestaciones')
      .where('year', year)
      .select('no_empleado', db.raw('COUNT(*) as conteo'))
      .groupBy('no_empleado')

    let red = 0, yellow = 0, green = 0
    rows.forEach(({ conteo }) => {
      const c = Number(conteo)
      if (c >= 3)      red++
      else if (c === 2) yellow++
      else              green++
    })

    const [{ total }] = await db
      .from('amonestaciones')
      .where('year', year)
      .count('* as total')

    return response.ok({
      year,
      total: Number(total),
      red,
      yellow,
      green,
    })
  }

  // GET /api/amonestaciones/resumen
  public async resumen({ request, response }: HttpContext) {
    const year = Number(request.qs().year) || new Date().getFullYear()

    const rows = await db
      .from('amonestaciones')
      .where('year', year)
      .select(
        'no_empleado',
        db.raw('MAX(nombre)      as nombre'),
        db.raw('MAX(planta)      as planta'),
        db.raw('MAX(departamento) as departamento'),
        db.raw('COUNT(*)         as conteo'),
        db.raw('MAX(ts)          as last_ts'),
        db.raw('MAX(fecha)       as last_fecha')
      )
      .groupBy('no_empleado')
      .orderBy('conteo', 'desc')

    const result = rows.map((r) => ({
      ...r,
      semaforo:
        Number(r.conteo) >= 3 ? 'rojo'
        : Number(r.conteo) === 2 ? 'amarillo'
        : 'verde',
    }))

    return response.ok(result)
  }

  // POST /api/amonestaciones
  public async store({ request, response }: HttpContext) {
    const payload = await this.validate(request.body())

    const [y, m, d] = payload.fecha.split('-').map(Number)
    const [hh, mm]  = payload.hora.split(':').map(Number)
    const ts = new Date(y, m - 1, d, hh, mm, 0).getTime()

    // Sobreescribimos 'fecha' convirtiendo el string a DateTime de Luxon
    const record = await Amonestacion.create({ 
      ...payload, 
      fecha: DateTime.fromISO(payload.fecha), // <-- Aquí está la magia
      year: y, 
      ts 
    })

    const [{ total }] = await db
      .from('amonestaciones')
      .where('no_empleado', payload.noEmpleado)
      .where('year', y)
      .count('* as total')

    const totalAnio = Number(total)

    return response.created({
      record,
      alerta: totalAnio >= 3,
      totalAnio,
    })
  }

 // PUT /api/amonestaciones/:id
  public async update({ params, request, response }: HttpContext) {
    const record  = await Amonestacion.findOrFail(params.id)
    const payload = await this.validate(request.body())

    const [y, m, d] = payload.fecha.split('-').map(Number)
    const [hh, mm]  = payload.hora.split(':').map(Number)
    const ts = new Date(y, m - 1, d, hh, mm, 0).getTime()

    // Igual aquí, convertimos la fecha antes de hacer el merge
    await record.merge({ 
      ...payload, 
      fecha: DateTime.fromISO(payload.fecha), // <-- Aquí también
      year: y, 
      ts 
    }).save()
    
    return response.ok(record)
  }

  // DELETE /api/amonestaciones/:id
  public async destroy({ params, response }: HttpContext) {
    const record = await Amonestacion.findOrFail(params.id)
    await record.delete()
    return response.noContent()
  }

  // GET /api/amonestaciones/export
  public async exportJSON({ response }: HttpContext) {
    const data = await Amonestacion.all()
    return response.ok({ version: 1, data })
  }

  // GET /api/amonestaciones/years
  public async years({ response }: HttpContext) {
    const rows = await db
      .from('amonestaciones')
      .distinct('year')
      .orderBy('year', 'desc')

    return response.ok(rows.map((r) => r.year))
  }
}