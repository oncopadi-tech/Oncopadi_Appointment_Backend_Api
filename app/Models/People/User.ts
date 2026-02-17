import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  manyToMany,
  ManyToMany,
  scope,
  hasOne,
  HasOne,
  computed,
  hasMany,
  HasMany,
  belongsTo,
  BelongsTo
} from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'
import Database from '@ioc:Adonis/Lucid/Database'
import { getRoleCodes, getGcsPublicUrl } from 'App/Helpers/Index'
import Consultation from '../Consultation/Consultation'
import Doctor from './Doctor'
import FirebaseToken from '../Misc/FirebaseToken'
import Subscription from '../Finance/Subscription'
import ProfileDatum from './ProfileDatum'
import Specialty from '../Medical/Specialty'
import { restore, search, softDelete, softDeleteQuery } from 'App/Helpers/Model'
import ChatGroup from '../Chat/ChatGroup'
import Symptom from '../Medical/Symptom'
import Medication from '../Medical/Medication'
import MedicalCondition from '../Medical/MedicalCondition'
import Forum from '../Community/Forum'
import ForumMessage from '../Community/ForumMessage'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public phone: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public address: string

  @column()
  public gender: string

  @column.dateTime()
  public dateOfBirth: DateTime

  @column({ serialize: (value) => getGcsPublicUrl(value) })
  public image: string

  @column()
  public active: boolean

  @column()
  public username: string

  @column()
  public rememberMeToken?: string

  @column()
  public cancerTypeId: number

  @column.dateTime({ autoCreate: true })
  public lastSeen: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime

  /**
   * Computed
   */
  @computed()
  public get age() {
    if (!this.dateOfBirth) return null
    return Math.abs(this.dateOfBirth.diffNow('years').years)
  }

  /**
   * Default Overrides
   */
  public async delete() {
    return softDelete(this)
  }

  public static restore = (id) => restore(User, id)

  /**
   * Hooks
   */
  @beforeSave()
  public static async hashPassword(peopleUser: User) {
    if (peopleUser.$dirty.password) {
      peopleUser.password = await Hash.make(peopleUser.password)
    }
  }

  /**
   * Relationships
   */

  @belongsTo(() => Specialty, { foreignKey: 'cancerTypeId' })
  public cancerType: BelongsTo<typeof Specialty>

  @manyToMany(() => ChatGroup)
  public chatGroups: ManyToMany<typeof ChatGroup>

  @manyToMany(() => Consultation, {
    pivotTable: 'consultation_attendances',
    onQuery: (query) =>
      !query.isRelatedQuery
        ? query
        : query.apply((scopes) => scopes.statuses(['confirmed']))
  })
  public confirmedConsultations: ManyToMany<typeof Consultation>

  @manyToMany(() => Consultation, {
    pivotTable: 'consultation_attendances',
    onQuery: (query) =>
      !query.isRelatedQuery
        ? query
        : query.apply((scopes) => scopes.statuses(['completed']))
  })
  public completedConsultations: ManyToMany<typeof Consultation>

  @manyToMany(() => Consultation, { pivotTable: 'consultation_attendances' })
  public consultations: ManyToMany<typeof Consultation>

  @hasOne(() => Doctor, {
    onQuery: (query) =>
      query.orderBy('updated_at', 'desc').where('active', true)
  })
  public doctor: HasOne<typeof Doctor>

  @hasOne(() => FirebaseToken, {
    onQuery: (query) => query.orderBy('created_at', 'desc')
  })
  public firebaseToken: HasOne<typeof FirebaseToken>

  @manyToMany(() => Forum)
  public forums: ManyToMany<typeof Forum>

  @hasMany(() => ForumMessage, { foreignKey: 'createdBy' })
  public forumMessages: HasMany<typeof ForumMessage>

  @hasMany(() => MedicalCondition)
  public medicalConditions: HasMany<typeof MedicalCondition>

  @hasMany(() => Medication)
  public medications: HasMany<typeof Medication>

  @hasMany(() => ProfileDatum)
  public profile: HasMany<typeof ProfileDatum>

  @manyToMany(() => Role)
  public roles: ManyToMany<typeof Role>

  @hasOne(() => Subscription, {
    onQuery: (query) => {
      query
        .where('starts_at', '<', DateTime.fromMillis(Date.now()).toSQL() || 0)
        .where('ends_at', '>', DateTime.fromMillis(Date.now()).toSQL() || 0)
        .orderBy('created_at', 'desc')
      if (!query.isRelatedQuery) return
      query.preload('plan')
    }
  })
  public subscription: HasOne<typeof Subscription>

  @hasMany(() => Symptom)
  public symptoms: HasMany<typeof Symptom>

  /**
   * Scopes
   */

  public static byRoles = scope((query, roles: Array<string>) => {
    const rolesQuery = Database.from('roles')
      .whereIn('code', roles)
      .select('roles.id')

    const roleUsersQuery = Database.from('role_user')
      .whereIn('role_id', rolesQuery)
      .select('user_id')

    return query.whereIn('users.id', roleUsersQuery)
  })

  public static byUser = scope((query, user?: User) => {
    const roleCodes = getRoleCodes(user)

    if (
      ['administrator'].filter((role) =>
        roleCodes.find((code) => code === role)
      ).length > 0
    )
      return query

    return query.where('id', user?.id || 0)
  })

  public static deleted = scope(softDeleteQuery)

  public static inForum = scope((query, forumIds: Array<number>) => {
    const userForumsQuery = Database.from('forum_user')
      .whereIn('forum_id', forumIds)
      .select('user_id')

    return query.whereIn('users.id', userForumsQuery)
  })

  public static search = search(
    ['name', 'email', 'username', 'phone', 'address'],
    User
  )
}
