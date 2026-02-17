import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  manyToMany,
  ManyToMany,
  hasMany,
  HasMany,
  scope,
  hasOne,
  HasOne
} from '@ioc:Adonis/Lucid/Orm'
import Doctor from '../People/Doctor'
import User from '../People/User'
import ConsultationAttendance from './ConsultationAttendance'
import { getRoleCodes } from 'App/Helpers/Index'
import Database from '@ioc:Adonis/Lucid/Database'
import ConsultationStatus from './ConsultationStatus'
import ConsultationLog from './ConsultationLog'
import Payment from '../Finance/Payment'
import HospitalReferral from '../Medical/HospitalReferral'
import TwilioRoom from './TwilioRoom'
import Order from '../Shop/Order'
import SubscriptionPlan from '../Finance/SubscriptionPlan'
import { restore, search, softDelete } from 'App/Helpers/Model'

const fourHours = 1000 * 3600 * 4

export default class Consultation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public enquiry: string

  @column.dateTime()
  public startsAt: DateTime

  @column.dateTime()
  public endedAt

  @column()
  public price: number

  @column()
  public currency: string

  @column()
  public doctorId: number

  @column()
  public notes: string

  @column()
  public prescription: string

  @column()
  public summary: string

  @column()
  public createdBy: number

  @column()
  public consultationStatusId: number

  @column()
  public subscriptionPlanId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Default Overrides
   */
  public async delete() {
    return softDelete(this)
  }

  public static restore = (id) => restore(Consultation, id)

  /**
   * Relationships
   */
  @manyToMany(() => User, {
    pivotTable: 'consultation_attendances',
    onQuery: (query) => {
      const absentQuery = Database.from('consultation_attendances')
        .whereNull('joined_at')
        .select('user_id')
      return query.whereIn('users.id', [absentQuery])
    }
  })
  public absent: ManyToMany<typeof User>

  @hasMany(() => ConsultationAttendance, {
    onQuery: (query) => {
      if (!query.isRelatedQuery) return
      return query.preload('user')
    }
  })
  public attendance: HasMany<typeof ConsultationAttendance>

  @manyToMany(() => Payment, {
    onQuery: (query) => query.whereNotNull('confirmed_at')
  })
  public confirmedPayments: ManyToMany<typeof Payment>

  @belongsTo(() => User, { foreignKey: 'createdBy' })
  public creator: BelongsTo<typeof User>

  @belongsTo(() => Doctor, {
    onQuery: (query) => {
      if (!query.isRelatedQuery) return
      return query.preload('user')
    }
  })
  public doctor: BelongsTo<typeof Doctor>

  @manyToMany(() => User, {
    pivotTable: 'consultation_attendances',
    onQuery: (query) => {
      const leftQuery = Database.from('consultation_attendances')
        .whereNotNull('joined_at')
        .whereNotNull('left_at')
        .orWhere(
          'joined_at',
          '<',
          DateTime.fromMillis(Date.now() - fourHours).toSQL() || ''
        )
        .select('user_id')
      return query.whereIn('users.id', [leftQuery])
    }
  })
  public left: ManyToMany<typeof User>

  @hasMany(() => ConsultationLog, {
    onQuery: (query) => (query.isRelatedQuery ? query.preload('status') : query)
  })
  public logs: HasMany<typeof ConsultationLog>

  @hasMany(() => Order)
  public orders: HasMany<typeof Order>

  @manyToMany(() => User, {
    pivotTable: 'consultation_attendances',
    onQuery: (query) => {
      if (!query.isRelatedQuery) return
      return query.apply((scopes) => scopes.byRoles(['patient']))
    }
  })
  public patients: ManyToMany<typeof User>

  @manyToMany(() => Payment, {
    onQuery: (query) => query.whereNull('confirmed_at')
  })
  public pendingPayments: ManyToMany<typeof Payment>

  @manyToMany(() => User, { pivotTable: 'consultation_attendances' })
  public people: ManyToMany<typeof User>

  @belongsTo(() => SubscriptionPlan)
  public plan: BelongsTo<typeof SubscriptionPlan>

  @manyToMany(() => User, {
    pivotTable: 'consultation_attendances',
    onQuery: (query) => {
      const presentQuery = Database.from('consultation_attendances')
        .whereNotNull('joined_at')
        .where(
          'joined_at',
          '>',
          DateTime.fromMillis(Date.now() - fourHours).toSQL() || ''
        )
        .select('user_id')
      return query.whereIn('users.id', [presentQuery])
    }
  })
  public present: ManyToMany<typeof User>

  @hasOne(() => HospitalReferral)
  public referral: HasOne<typeof HospitalReferral>

  @belongsTo(() => ConsultationStatus)
  public status: BelongsTo<typeof ConsultationStatus>

  @hasOne(() => TwilioRoom)
  public twilioRoom: HasOne<typeof TwilioRoom>

  /**
   * Scopes
   */
  public static byUser = scope((query, user?: User) => {
    const roleCodes = getRoleCodes(user)
    if (roleCodes.includes('administrator')) return query

    return Consultation.byUserId(query, user?.id || 0)
  })

  public static byUserId = scope((query, userId: number) => {
    const userConsultationQuery = Database.from('consultation_attendances')
      .where('user_id', userId)
      .select('consultation_id')

    return query.whereIn('id', userConsultationQuery)
  })

  public static search = search(
    ['enquiry', 'price', 'notes', 'prescription', 'summary'],
    Consultation
  )

  public static statuses = scope((query, statuses: Array<string>) => {
    const statusQuery = Database.from('consultation_statuses')
      .whereIn('code', statuses)
      .select('id')
    return query.whereIn('consultation_status_id', statusQuery)
  })
}
