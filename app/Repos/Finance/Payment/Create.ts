import Payment from 'App/Models/Finance/Payment'
import PaymentMethod from 'App/Models/Finance/PaymentMethod'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import User from 'App/Models/People/User'

export default class Create {
  async handle(
    {
      amount,
      currency = 'NGN',
      method,
      user
    }: {
      amount: number
      currency?: string
      method: string
      user?: User
    },
    auth?: AuthContract
  ) {
    const paymentMethod = await PaymentMethod.findByOrFail('code', method)
    var reference: string
    do {
      reference = Math.random().toString(36).slice(2)
    } while ((await Payment.findBy('reference', reference)) !== null)

    const payment = await Payment.create({
      amount,
      currency,
      reference,
      paymentMethodId: paymentMethod.id,
      createdBy: auth?.user?.id,
      userId: user?.id
    })

    return payment
  }
}
