import Paystack from 'App/Services/Paystack/Paystack'
import Payment from 'App/Models/Finance/Payment'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { DateTime } from 'luxon'
import ConfirmPayment from 'App/Repos/Consultation/Consultation/ConfirmPayment'
import logger from '@ioc:Adonis/Core/Logger'

export default class Confirm {
  async handle(id, { reference, method }, auth?: AuthContract) {
    if (method === 'paystack')
      return this.verifyWithPaystack({ id, reference }, auth)
  }

  private async verifyWithPaystack({ id, reference }, auth) {
    const payment = await Payment.query()
      .where('reference', id)
      .orWhere('id', id)
      .preload('consultations')
      .firstOrFail()

    reference = reference ? reference : payment.reference

    await new Paystack().verifyTransaction(reference, payment.amount)

    payment.confirmedAt = DateTime.fromMillis(Date.now())
    payment.reference = reference
    await payment.save()

    for (const consultation of payment.consultations) {
      try {
        await new ConfirmPayment().handle(consultation.id, auth)
      } catch (error) {
        logger.error(error)
      }
    }

    return payment
  }
}
