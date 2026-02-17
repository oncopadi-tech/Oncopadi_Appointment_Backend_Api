import Env from '@ioc:Adonis/Core/Env'
import { DateTime } from 'luxon'

const oncopadiConfig = {
  admin: {
    name: Env.get('ADMIN_NAME') as string,
    email: Env.get('ADMIN_EMAIL') as string,
    phone: Env.get('ADMIN_PHONE') as string,
    password: Env.get('ADMIN_PASSWORD') as string,
    address: Env.get('ADMIN_ADDRESS') as string,
    gender: Env.get('ADMIN_GENDER') as string,
    dateOfBirth: DateTime.fromSQL('2000-05-01') as DateTime,
    roles: ['administrator'],
    image: undefined,
    cancerType: undefined
  }
}

export const loyaltyPoints = {
  completedConsultations: 2,
  symptoms: 0.1,
  medications: 0.1,
  medicalConditions: 1,
  forums: 0.1,
  forumMessages: 0.1,
  bio: 10,
  profile: 20,
  shop: [
    { min: 5000, max: 6000, points: 2 },
    { min: 6000, max: 30000, points: 4 },
    { min: 30000, max: 70000, points: 8 },
    { min: 70000, max: Infinity, points: 10 }
  ]
}

export const textHelpMesssage = `If you require assistance, send us a message on the app or contact us on +234 906 044 3513. 
Thank you for choosing Oncopadi.`

export default oncopadiConfig
