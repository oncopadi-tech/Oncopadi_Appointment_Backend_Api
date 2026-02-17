import CreateConsultationValidator from 'App/Validators/Consultation/CreateConsultationValidator'
import Consultation from 'App/Models/Consultation/Consultation'
import Doctor from 'App/Models/People/Doctor'
import CreateAttendance from 'App//Repos/Consultation/Attendance/Create'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import CreateLog from 'App//Repos/Consultation/Log/Create'
import ConsultationStatus from 'App/Models/Consultation/ConsultationStatus'
import CreatePayment from 'App/Repos/Finance/Payment/Create'
import ValidateCoupon from 'App/Repos/Finance/Coupon/Validate'
import ConfirmPayment from './ConfirmPayment'
import CreateActivity from 'App/Repos/Misc/Activity/Create'

export default class Create {
  async handle(
    {
      enquiry,
      startsAt,
      doctorId,
      attendees,
      couponCode,
      subscriptionPlanId
    }: typeof CreateConsultationValidator.parsedSchema.props,
    auth: AuthContract
  ) {
    const createdBy = !auth.user ? 0 : auth.user.id

    const doctor = await Doctor.find(doctorId ? doctorId : 0)
    if (doctor) {
      if (!attendees.includes(doctor.userId)) attendees.push(doctor.userId)
    }

    const status = await ConsultationStatus.findByOrFail('code', 'created')

    const subscriptionPlan = await new ValidateCoupon().handle(
      {
        couponCode,
        subscriptionPlanId
      },
      auth
    )

    // create consultation
    const consultation = await Consultation.create({
      doctorId,
      enquiry,
      price: subscriptionPlan.discountedPrice,
      currency: subscriptionPlan.currency,
      createdBy,
      consultationStatusId: status.id,
      subscriptionPlanId,
      startsAt
    })

    // create and attach payment
    var payment: any = null

    if (consultation.price > 0) {
      payment = await new CreatePayment().handle(
        {
          amount: consultation.price,
          currency: consultation.currency,
          method: 'paystack',
          user: auth?.user
        },
        auth
      )

      await consultation.related('pendingPayments').attach([payment.id])
    } else {
      await new ConfirmPayment().handle(consultation.id, auth)
    }

    // attach attendees
    attendees.forEach(async (userId) => {
      await new CreateAttendance().handle({
        userId,
        consultationId: consultation.id
      })
    })

    // create log
    await new CreateLog().handle(consultation, 'Consultation Created', auth)

    await new CreateActivity().handle('You booked a Consultation', auth)

    return { consultation, payment }
  }
}
