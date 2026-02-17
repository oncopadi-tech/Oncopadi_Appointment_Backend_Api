import Env from '@ioc:Adonis/Core/Env'

export const auth = {
  username: Env.get('WOO_COMMERCE_CONSUMER_KEY', null) as string,
  password: Env.get('WOO_COMMERCE_CONSUMER_SECRET', null) as string
}

export const orderStatuses = [
  'pending',
  'processing',
  'on-hold',
  'completed',
  'cancelled',
  'refunded',
  'failed',
  'trash'
] as const
