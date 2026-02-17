import HospitalReferral from 'App/Models/Medical/HospitalReferral'

export default class CreateOrUpdate {
  async handle({ consultationId, hospitalId, patientId, doctorId, comment }) {
    const hospitalReferral = await HospitalReferral.updateOrCreate(
      {
        consultationId
      },
      {
        hospitalId,
        patientId,
        doctorId,
        comment
      }
    )
    return hospitalReferral
  }
}
