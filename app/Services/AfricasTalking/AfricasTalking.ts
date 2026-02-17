import logger from '@ioc:Adonis/Core/Logger'
import Axios, { AxiosInstance } from 'axios'
import aTConfig from 'Config/africasTalking'
import { stringify } from 'querystring'

export default class AfricasTalking {
  public client: AxiosInstance
  private requestData: { [key: string]: any } = {
    username: aTConfig.username,
    from: aTConfig.senderId
  }

  constructor() {
    this.client = Axios.create({
      baseURL: aTConfig.baseUrl,
      headers: {
        common: { apiKey: aTConfig.apiKey },
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }

  /**
   * sendSMS
   */
  public async sendSMS(message, to) {
    try {
      return await this.client.post(
        'messaging',
        stringify({
          ...this.requestData,
          to,
          message
        })
      )
    } catch (error) {
      logger.error('Could not send SMS', error)
    }
  }
}
