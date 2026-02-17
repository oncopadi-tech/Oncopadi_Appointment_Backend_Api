import Env from '@ioc:Adonis/Core/Env'

const fcmConfig = {
  url: 'https://fcm.googleapis.com',
  timeout: 30.0, // in seconds

  app: {
    serverKey: Env.get('FCM_SERVER_KEY', null) as string,
    senderId: Env.get('FCM_SENDER_ID', null) as string,
    credentials: Env.get('FIREBASE_KEY_FILE', null) as string,
    dbURL: Env.get('FIREBASE_DB_URL', null) as string,
    bundleId: Env.get('FCM_BUNDLE_ID', null) as string
  }
}

export default fcmConfig
