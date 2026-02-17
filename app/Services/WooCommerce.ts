import Axios, { AxiosInstance, AxiosResponse } from 'axios'
import { cmsUrl } from 'Config/app'
import { auth } from 'Config/woocommerce'
import { Billing, CreateOrder, Customer, Order } from 'Contracts/woocommerce'

export default class WooCommerce {
  public $axios: AxiosInstance

  constructor() {
    this.$axios = Axios.create({
      baseURL: cmsUrl
    })
  }

  public async createCustomer(
    customer: {
      email?: string
      first_name?: string
      last_name?: string
      username?: string
      billing: Billing
      shipping: Billing
    },
    dataOnly = true
  ): Promise<Customer & AxiosResponse<Customer>> {
    const response = await this.$axios.post(
      'wp-json/wc/v3/customers',
      customer,
      { auth }
    )
    return dataOnly ? response.data : response
  }

  public async createOrder(
    order: CreateOrder,
    dataOnly = true
  ): Promise<(Order & AxiosResponse<Order>) | Order> {
    const response = await this.$axios.post('wp-json/wc/v3/orders', order, {
      auth
    })
    return dataOnly ? response.data : response
  }

  public async getCustomers(
    { email, perPage = 100, search = null },
    dataOnly = true
  ): Promise<Customer[] & AxiosResponse<Customer[]>> {
    const response = await this.$axios.get('wp-json/wc/v3/customers', {
      auth,
      params: {
        email,
        per_page: perPage,
        search
      }
    })

    return !dataOnly ? response : response.data
  }

  public async getOrder(
    id,
    dataOnly = true
  ): Promise<Order & AxiosResponse<Order>> {
    const response = await this.$axios.get(`wp-json/wc/v3/orders/${id}`, {
      auth
    })

    return !dataOnly ? response : response.data
  }

  public async getOrders(
    {
      customer,
      order = 'desc',
      orderby = 'date',
      perPage = 100,
      search = null
    },
    dataOnly = true
  ): Promise<Order[] & AxiosResponse<Order[]>> {
    const response = await this.$axios.get('wp-json/wc/v3/orders', {
      auth,
      params: {
        customer,
        order,
        orderby,
        per_page: perPage,
        search
      }
    })

    return !dataOnly ? response : response.data
  }

  public async getPaymentGateWays() {
    const response = await this.$axios.get('wp-json/wc/v3/payment_gateways', {
      auth
    })
    return response.data
  }

  public async getProductAttibutes({ perPage = 10 }) {
    const response = await this.$axios.get(
      'wp-json/wc/v3/products/attributes',
      {
        auth,
        params: {
          per_page: perPage
        }
      }
    )
    return response.data
  }

  public async getProductAttibuteTerms({ attributeId, perPage = 100 }) {
    const response = await this.$axios.get(
      `wp-json/wc/v3/products/attributes/${attributeId}/terms`,
      {
        auth,
        params: {
          per_page: perPage
        }
      }
    )
    return response.data
  }

  public async getProductCategories({}) {
    const response = await this.$axios.get(
      'wp-json/wc/v3/products/categories',
      { auth }
    )
    return response.data
  }

  public async getProductVariations({ productId, perPage = 100 }) {
    const response = await this.$axios.get(
      `wp-json/wc/v3/products/${productId}/variations`,
      {
        auth,
        params: {
          per_page: perPage
        }
      }
    )
    return response.data
  }

  public async getProducts({ category, perPage = 100, search }) {
    const response = await this.$axios.get('wp-json/wc/v3/products', {
      auth,
      params: {
        category,
        per_page: perPage,
        search
      }
    })
    return response.data
  }

  public getCategoryImage(category) {
    try {
      return category.image.src
    } catch (error) {
      return 'https://via.placeholder.com/500x500'
    }
  }

  public getProductImage(product) {
    try {
      return product.images[0].src
    } catch (error) {
      return 'https://via.placeholder.com/500x500'
    }
  }

  public async retrieveProduct(productId) {
    const response = await this.$axios.get(
      `wp-json/wc/v3/products/${productId}`,
      { auth }
    )
    return response.data
  }

  public async updateCustomer(
    id,
    customer: {
      email?: string
      first_name?: string
      last_name?: string
      username?: string
      billing?: Billing
      shipping?: Billing
    },
    dataOnly = true
  ): Promise<Customer & AxiosResponse<Customer>> {
    const response = await this.$axios.put(
      `wp-json/wc/v3/customers/${id}`,
      customer,
      { auth }
    )
    return dataOnly ? response.data : response
  }
}
