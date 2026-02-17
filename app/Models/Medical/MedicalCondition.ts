import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  scope
} from '@ioc:Adonis/Lucid/Orm'
import Specialty from './Specialty'
import User from '../People/User'
import { getRoleCodes } from 'App/Helpers/Index'
import Comorbidity from './Comorbidity'
import DiseaseGrade from './DiseaseGrade'
import DiseaseStage from './DiseaseStage'

export default class MedicalCondition extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public centre: string

  @column()
  public diagnosis: string

  @column.dateTime()
  public date: DateTime

  @column()
  public ageAtDiagnosis: number

  @column()
  public histology: string

  @column()
  public specialtyId: number

  @column()
  public userId: number

  @column()
  public comorbidityId: number

  @column()
  public diseaseGradeId: number

  @column()
  public diseaseStageId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationships
   */
  @belongsTo(() => Comorbidity)
  public cormobidity: BelongsTo<typeof Comorbidity>

  @belongsTo(() => DiseaseGrade)
  public grade: BelongsTo<typeof DiseaseGrade>

  @belongsTo(() => Specialty)
  public specialty: BelongsTo<typeof Specialty>

  @belongsTo(() => DiseaseStage)
  public stage: BelongsTo<typeof DiseaseStage>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  /**
   * Scopes
   */
  public static byUser = scope((query, user?: User) => {
    const roleCodes = getRoleCodes(user)

    if (
      ['administrator', 'doctor'].filter((role) =>
        roleCodes.find((code) => code === role)
      ).length > 0
    )
      return query

    return query.where('user_id', user?.id || 0)
  })
}
