// External Dependencies
import Axios, { AxiosInstance } from 'axios'
import { Exception } from '@poppinss/utils'

// COnfig
import paystackConfig from 'Config/paystack'
import logger from '@ioc:Adonis/Core/Logger'

export default class Paystack {
  public client: AxiosInstance

  constructor() {
    this.client = Axios.create({
      baseURL: paystackConfig.baseUrl,
      headers: {
        common: {
          Authorization: `Bearer ${paystackConfig.secretKey}`
        }
      }
    })
  }

  public async verifyTransaction(reference, amount = 0) {
    try {
      const response = await this.client(`/transaction/verify/${reference}`)

      if (response.data.data?.status !== 'success')
        throw new Exception('invalid transaction', 400)

      if (response.data.data?.amount < amount * 100)
        throw new Exception('amount paid is less than amount requested', 400)

      return { paystackResponse: response.data }
    } catch (error) {
      logger.error(error)
      throw new Exception(error, 400)
    }
  }

  public async chargeCard(data: {
    authorization_code: string
    email: string
    amount: number
  }) {
    try {
      const response = await this.client.post(
        'transaction/charge_authorization',
        data
      )
      return response.data
    } catch (error) {
      throw new Exception(error, 400)
    }
  }
}
