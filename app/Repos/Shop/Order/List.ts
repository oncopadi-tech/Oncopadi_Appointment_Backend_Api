import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import User from 'App/Models/People/User'
import WooCommerce from 'App/Services/WooCommerce'
import SaveCustomer from '../Customer/Save'
import { Exception } from '@poppinss/utils'
import logger from '@ioc:Adonis/Core/Logger'

export default class List {
  async handle(
    {
      userId
    }: {
      relationships?: string[]
      page?: number
      perPage?: number
      sortBy?: string
      sortOrder?: string
      userId?: number
    },
    auth: AuthContract | { user: User }
  ) {
    if (typeof userId === 'undefined') userId = auth.user?.id

    try {
      const user = await User.findOrFail(userId)

      const customer = await new SaveCustomer().handle(user)

      const response = await new WooCommerce().getOrders(
        { customer: customer.id },
        false
      )

      return {
        meta: {
          total: Number(response.headers['x-wp-total'])
        },
        data: response.data
      }
    } catch (error) {
      logger.error(error)
      throw new Exception(error)
    }
  }
}
