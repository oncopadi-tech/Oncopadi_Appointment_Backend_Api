import Payment from 'App/Models/Finance/Payment'

export default class Retry {
  async handle({ reference, method }) {
    const payment = await Payment.query()
      .where('reference', reference)
      .orWhere('id', reference)
      .whereNull('confirmed_at')
      .firstOrFail()

    var newReference: string

    do {
      newReference = Math.random().toString(36).slice(2)
    } while ((await Payment.findBy('reference', newReference)) !== null)

    payment.reference = newReference
    payment.method = typeof method !== 'undefined' ? method : payment.method
    await payment.save()

    return Payment.findOrFail(payment.id)
  }
}
