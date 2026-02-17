import CreateOrUpdateFirebaseTokenValidator from 'App/Validators/Misc/CreateOrUpdateFirebaseTokenValidator'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import FirebaseToken from 'App/Models/Misc/FirebaseToken'

export default class CreateOrUpdate {
  async handle(
    {
      userId,
      app,
      token
    }: typeof CreateOrUpdateFirebaseTokenValidator.parsedSchema.props,
    auth: AuthContract
  ) {
    userId = userId ? userId : auth ? auth.user?.id : 0

    const firebaseToken = await FirebaseToken.updateOrCreate(
      { userId },
      { token, app }
    )

    return firebaseToken
  }
}
