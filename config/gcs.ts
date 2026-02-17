import Env from '@ioc:Adonis/Core/Env'

/**
 * Google Cloud Storage Config
 */
const gcsConfig = {
  bucketName: Env.get('GCS_BUCKET') as string,

  pathPrefix: Env.get('GCS_PATH_PREFIX') as string
}

export default gcsConfig
