import CreateComment from 'App/Repos/Misc/Comment/Create'
import Consultation from 'App/Models/Consultation/Consultation'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import User from 'App/Models/People/User'

export default class Create {
  async handle(
    consultation: Consultation,
    title,
    auth?: AuthContract | { user: User }
  ) {
    const comment = await new CreateComment().handle({ title }, auth)

    return await consultation.related('logs').create({
      commentId: comment.id,
      createdBy: consultation.createdBy,
      consultationStatusId: consultation.consultationStatusId
    })
  }
}
