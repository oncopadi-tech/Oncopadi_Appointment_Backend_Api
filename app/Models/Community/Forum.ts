import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  manyToMany,
  ManyToMany,
  belongsTo,
  BelongsTo,
  scope,
  computed,
  hasMany,
  HasMany
} from '@ioc:Adonis/Lucid/Orm'
import Topic from './Topic'
import User from '../People/User'
import { getRoleCodes } from 'App/Helpers/Index'
import Database from '@ioc:Adonis/Lucid/Database'
import { restore, search, softDelete } from 'App/Helpers/Model'
import ForumMessage from './ForumMessage'

export default class Forum extends BaseModel {
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

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime

  /**
   * Computed
   */
  @computed()
  public get meta() {
    return this.$extras
  }

  /**
   * Default Overrides
   */
  public async delete() {
    return softDelete(this)
  }

  public static restore = (id) => restore(Forum, id)

  /**
   * Relationships
   */
  @belongsTo(() => User, { foreignKey: 'createdBy' })
  public creator: BelongsTo<typeof User>

  @manyToMany(() => User)
  public members: ManyToMany<typeof User>

  @hasMany(() => ForumMessage)
  public messages: HasMany<typeof ForumMessage>

  @manyToMany(() => Topic)
  public topics: ManyToMany<typeof Topic>

  /**
   * Scopes
   */
  public static isMember = scope(
    (
      query,
      { isMember = 'true', user }: { isMember?: string; user?: User }
    ) => {
      const forumUserQuery = Database.from('forum_user')
        .where('user_id', user?.id || 0)
        .select('forum_id')

      if (isMember === 'true') return query.whereIn('id', forumUserQuery)

      return query.whereNotIn('id', forumUserQuery)
    }
  )

  public static byUser = scope((query, user?: User) => {
    const roleCodes = getRoleCodes(user)

    if (
      ['administrator'].filter((role) =>
        roleCodes.find((code) => code === role)
      ).length > 0
    )
      return query

    const forumUserQuery = Database.from('forum_user')
      .where('user_id', user?.id || 0)
      .select('forum_id')

    return query.whereIn('id', forumUserQuery)
  })

  public static search = search(['name', 'slug', 'description'], Forum)
}
