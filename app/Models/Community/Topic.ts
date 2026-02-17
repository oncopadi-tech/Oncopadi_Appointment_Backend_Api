import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  manyToMany,
  ManyToMany
} from '@ioc:Adonis/Lucid/Orm'
import User from '../People/User'
import Forum from './Forum'

export default class Topic extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public description: string

  @column()
  public active: boolean

  @column()
  public createdBy: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationships
   */
  @belongsTo(() => User, { foreignKey: 'createdBy' })
  public creator: BelongsTo<typeof User>

  @manyToMany(() => Forum)
  public topics: ManyToMany<typeof Forum>
}
