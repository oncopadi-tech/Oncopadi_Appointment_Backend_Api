import Env from '@ioc:Adonis/Core/Env'

const twilioConfig = {
  accountSid: Env.get('TWILIO_ACCOUNT_SID', null) as string,
  apiKey: Env.get('TWILIO_API_KEY', null) as string,
  apiSecret: Env.get('TWILIO_API_SECRET', null) as string,
  authToken: Env.get('TWILIO_AUTH_TOKEN', null) as string,
  roomExpiration: 1000 * 60 * 5, // 5 minutes
  roomType: 'peer-to-peer'
}

export default twilioConfig
