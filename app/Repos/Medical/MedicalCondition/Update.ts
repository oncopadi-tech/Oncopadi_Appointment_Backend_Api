import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { slugify } from 'App/Helpers/Index'
import Comorbidity from 'App/Models/Medical/Comorbidity'
import DiseaseGrade from 'App/Models/Medical/DiseaseGrade'
import DiseaseStage from 'App/Models/Medical/DiseaseStage'
import MedicalCondition from 'App/Models/Medical/MedicalCondition'
import Specialty from 'App/Models/Medical/Specialty'
import UpdateMedicalConditionValidator from 'App/Validators/Medical/UpdateMedicalConditionValidator'

export default class Update {
  public async handle(
    id,
    data: typeof UpdateMedicalConditionValidator.props,
    auth?: AuthContract
  ) {
    var medicalCondition = await MedicalCondition.query()
      .apply((scopes) => scopes.byUser(auth?.user))
      .where('id', id)
      .firstOrFail()

    for (const key in data) {
      if (
        [
          'diagnosis',
          'date',
          'ageAtDiagnosis',
          'centre',
          'histology',
          'cancerType'
        ].includes(key)
      )
        medicalCondition[key] =
          typeof data[key] !== 'undefined' ? data[key] : data[key]
    }

    if (typeof data.cancerType !== 'undefined') {
      const specialty = await Specialty.firstOrCreate(
        { code: slugify(data.cancerType) },
        { name: data.cancerType }
      )
      medicalCondition.specialtyId = specialty.id
    }

    if (typeof data.comorbidity !== 'undefined') {
      medicalCondition.comorbidityId = (
        await Comorbidity.firstOrCreate(
          { code: slugify(data.comorbidity) },
          { name: data.comorbidity }
        )
      ).id
    }

    if (typeof data.stage !== 'undefined') {
      medicalCondition.diseaseStageId = (
        await DiseaseStage.firstOrCreate(
          { code: slugify(data.stage) },
          { name: data.stage }
        )
      ).id
    }

    if (typeof data.grade !== 'undefined') {
      medicalCondition.diseaseGradeId = (
        await DiseaseGrade.firstOrCreate(
          { code: slugify(data.grade) },
          { name: data.grade }
        )
      ).id
    }

    await medicalCondition.save()

    return medicalCondition
  }
}
