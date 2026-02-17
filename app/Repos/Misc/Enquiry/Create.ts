import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import Enquiry from 'App/Models/Misc/Enquiry'

export default class Create {
  async handle(
    { title, message, email, replyTo, sentTo },
    auth?: AuthContract
  ) {
    const enquiry = await Enquiry.create({
      title,
      message,
      email: auth?.user?.email || email,
      createdBy: auth?.user?.id || 0,
      replyTo,
      sentTo
    })

    return enquiry
  }
}
