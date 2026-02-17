import Env from '@ioc:Adonis/Core/Env'

const paystackConfig = {
  publicKey: Env.get('PAYSTACK_PUBLIC_KEY', null) as string,
  secretKey: Env.get('PAYSTACK_SECRET_KEY', null) as string,
  baseUrl: Env.get('PAYSTACK_BASE_URL', null) as string
}

export default paystackConfig
