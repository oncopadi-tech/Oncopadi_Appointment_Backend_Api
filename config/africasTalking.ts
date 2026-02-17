import Env from '@ioc:Adonis/Core/Env'

const aTConfig = {
  username: Env.get('AT_USERNAME', null) as string,
  apiKey: Env.get('AT_API_KEY', null) as string,
  senderId: Env.get('AT_SENDER_ID', null) as string,
  baseUrl: Env.get('AT_BASE_URL', null) as string
}

export default aTConfig
