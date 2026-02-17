import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class ViewsController {
  public async index({ response }: HttpContextContract) {
    return response.json({ message: "hello" });
  }
}
