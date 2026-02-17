import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { getGcsPublicUrl } from 'App/Helpers/Index'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column({ serialize: (value) => getGcsPublicUrl(value) })
  public path: string

  @column()
  public type: string

  @column()
  public createdBy: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
