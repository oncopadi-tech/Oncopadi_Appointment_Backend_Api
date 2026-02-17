import User from 'App/Models/People/User'
import WooCommerce from 'App/Services/WooCommerce'

export default class Save {
  async handle(user: User) {
    var woo = new WooCommerce()
    var customer = (
      await woo.getCustomers({
        email: user.email
      })
    )[0]

    const billing = {
      first_name: user.name,
      address_1: user.address || 'Not set',
      email: user.email,
      phone: user.phone
    }

    if (!customer) {
      customer = await woo.createCustomer({
        email: user.email,
        first_name: user.name,
        billing,
        shipping: billing
      })
    } else {
      customer = await woo.updateCustomer(customer.id, {
        email: user.email,
        first_name: user.name,
        billing,
        shipping: billing
      })
    }

    return customer
  }
}
