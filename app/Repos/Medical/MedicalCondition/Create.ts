import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { getRoleCodes, slugify } from 'App/Helpers/Index'
import MedicalCondition from 'App/Models/Medical/MedicalCondition'
import Specialty from 'App/Models/Medical/Specialty'
import StoreMedicalConditionValidator from 'App/Validators/Medical/StoreMedicalConditionValidator'
import { Exception } from '@poppinss/utils'
import User from 'App/Models/People/User'
import Comorbidity from 'App/Models/Medical/Comorbidity'
import DiseaseStage from 'App/Models/Medical/DiseaseStage'
import DiseaseGrade from 'App/Models/Medical/DiseaseGrade'

export default class Create {
  async handle(
    {
      date,
      diagnosis,
      ageAtDiagnosis,
      centre,
      cancerType,
      histology,
      userId,
      comorbidity,
      stage,
      grade
    }: typeof StoreMedicalConditionValidator.props,
    auth?: AuthContract
  ) {
    if (typeof userId === 'undefined') {
      userId = auth?.user?.id || 0
    } else {
      const roleCodes = getRoleCodes(auth?.user)
      if (
        ['administrator', 'doctor'].filter((role) =>
          roleCodes.find((code) => code === role)
        ).length < 1
      ) {
        throw new Exception(
          'you are not allowed register conditions for this user',
          403
        )
      }
    }

    var specialtyId, comorbidityId, diseaseGradeId, diseaseStageId
    const user = await User.findOrFail(userId)

    if (typeof cancerType !== 'undefined') {
      const specialty = await Specialty.firstOrCreate(
        { code: slugify(cancerType) },
        { name: cancerType }
      )
      specialtyId = specialty.id
    } else {
      specialtyId = user.cancerTypeId
    }

    if (typeof comorbidity !== 'undefined') {
      comorbidityId = (
        await Comorbidity.firstOrCreate(
          { code: slugify(comorbidity) },
          { name: comorbidity }
        )
      ).id
    }

    if (typeof stage !== 'undefined') {
      diseaseStageId = (
        await DiseaseStage.firstOrCreate(
          { code: slugify(stage) },
          { name: stage }
        )
      ).id
    }

    if (typeof grade !== 'undefined') {
      diseaseGradeId = (
        await DiseaseGrade.firstOrCreate(
          { code: slugify(grade) },
          { name: grade }
        )
      ).id
    }

    const medicalCondition = await MedicalCondition.create({
      date,
      diagnosis,
      ageAtDiagnosis,
      centre,
      histology,
      userId,
      specialtyId,
      comorbidityId,
      diseaseStageId,
      diseaseGradeId
    })

    return medicalCondition
  }
}
