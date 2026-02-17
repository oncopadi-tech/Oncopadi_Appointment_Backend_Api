import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Create from "App/Repos/Shop/Order/Create";
import List from "App/Repos/Shop/Order/List";
import WooCommerce from "App/Services/WooCommerce";
import StoreOrderValidator from "App/Validators/Shop/StoreOrderValidator";

export default class OrdersController {
  public async index({ auth, request, response }: HttpContextContract) {
    const results = await new List().handle(request.get(), auth);

    return response.json(results);
  }

  public async store({ request, response }: HttpContextContract) {
    const data = await request.validate(StoreOrderValidator);

    const order = await new Create().handle(data);

    return response.json({ status: true, order });
  }

  public async show({ params, response }: HttpContextContract) {
    const order = await new WooCommerce().getOrder(params.id);

    return response.json({ status: true, order });
  }

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
