import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  scope
} from '@ioc:Adonis/Lucid/Orm'
import ProfileField from './ProfileField'
import User from './User'
import Database from '@ioc:Adonis/Lucid/Database'
import { slugify } from 'App/Helpers/Index'

export default class ProfileDatum extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public value: string

  @column()
  public profileFieldId: number

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationships
   */

  @belongsTo(() => ProfileField)
  public field: BelongsTo<typeof ProfileField>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  /**
   * Scopes
   */
  public static byCategories = scope((query, categories) => {
    const fieldCategoryQuery = Database.from('profile_fields')
      .whereIn('category', categories)
      .select('id')

    return query.whereIn('profile_field_id', fieldCategoryQuery)
  })

  public static byFields = scope((query, fields) => {
    fields = fields.map((field) => slugify(field))

    const fieldCodesQuery = Database.from('profile_fields')
      .whereIn('code', fields)
      .select('id')

    return query.whereIn('profile_field_id', fieldCodesQuery)
  })

  public static byUser = scope((query, user?: User) =>
    query.where('user_id', user?.id || 0)
  )
}
