import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { getRoleCodes, slugify } from 'App/Helpers/Index'
import StoreHospitalVisitValidator from 'App/Validators/Medical/StoreHospitalVisitValidator'
import { Exception } from '@poppinss/utils'
import CreateComment from 'App/Repos/Misc/Comment/Create'
import HospitalVisit from 'App/Models/Medical/HospitalVisit'
import Vital from 'App/Models/Medical/Vital'
import VisitVital from 'App/Models/Medical/VisitVital'

export default class Record {
  async handle(
    {
      summary,
      date,
      vitals,
      userId,
      doctorId,
      hospitalId
    }: typeof StoreHospitalVisitValidator.props,
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
          'you are not allowed record hospital visits for this user',
          403
        )
      }
    }

    var commentId
    if (summary) {
      commentId = (await new CreateComment().handle({ title: summary }, auth))
        .id
    }

    const hospitalVisit = await HospitalVisit.create({
      commentId,
      date,
      userId,
      doctorId,
      hospitalId
    })

    return {
      hospitalVisit,
      vitals: await this.recordVitals(vitals, hospitalVisit)
    }
  }

  async recordVitals(
    vitals: Array<{ vital: string; value: string }>,
    hospitalVisit: HospitalVisit
  ) {
    const existingVitals = await Vital.query().where('active', true)
    var newVitals = new Array<VisitVital>()

    for (const data of vitals) {
      var vital = existingVitals.find((v) => v.code === data.vital)
      if (!vital) {
        vital = await Vital.firstOrCreate(
          { code: slugify(data.vital) },
          { name: data.vital }
        )
      }

      newVitals.push(
        await VisitVital.updateOrCreate(
          {
            vitalId: vital.id,
            userId: hospitalVisit.userId,
            hospitalVisitId: hospitalVisit.id
          },
          { value: data.value }
        )
      )
    }

    return newVitals
  }
}
