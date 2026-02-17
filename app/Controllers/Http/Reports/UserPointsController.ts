import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserPoints from 'App/Repos/Reports/UserPoints'

export default class UserPointsController {
  public async index({ auth, request, response }: HttpContextContract) {
    const { userId = auth.user?.id } = request.get()
    const stats = await new UserPoints().handle(userId)
    return response.json(stats)
  }
}
