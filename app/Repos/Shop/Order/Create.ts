import User from 'App/Models/People/User'
import Order from 'App/Models/Shop/Order'
import WooCommerce from 'App/Services/WooCommerce'
import StoreOrderValidator from 'App/Validators/Shop/StoreOrderValidator'
import SaveCustomer from '../Customer/Save'

export default class Create {
  async handle({
    consultationId,
    userId,
    items
  }: typeof StoreOrderValidator.props) {
    const user = await User.findOrFail(userId)

    const customer = await new SaveCustomer().handle(user)

    const wooOrder = await new WooCommerce().createOrder({
      payment_method: 'paystack',
      payment_method_title: 'Debit/Credit Cards',
      set_paid: false,
      billing: customer.billing,
      shipping: customer.billing,
      line_items: items,
      shipping_lines: [
        {
          method_id: 'flat_rate',
          method_title: 'Flat Rate',
          total: '0'
        }
      ]
    })

    const order = await Order.create({
      woocommerceOrderId: wooOrder.id,
      userId,
      consultationId
    })

    return order
  }
}
