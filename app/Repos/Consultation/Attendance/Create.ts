import ConsultationAttendance from 'App/Models/Consultation/ConsultationAttendance'

export default class Create {
  async handle({ userId, consultationId }) {
    return ConsultationAttendance.firstOrCreate({ userId, consultationId })
  }
}
