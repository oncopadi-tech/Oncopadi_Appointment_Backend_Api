import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import permissionsConfig from 'Config/permissions'
import Entity from 'App/Models/Misc/Entity'
import logger from '@ioc:Adonis/Core/Logger'

export default class EntitySeeder extends BaseSeeder {
  public static async run() {
    logger.info('seeding entities')

    const entities = Object.keys(permissionsConfig)

    await Entity.updateOrCreateMany(
      'code',
      entities.map((entity) => ({
        name: entity,
        code: entity
      }))
    )

    logger.info('done seeding entities')
  }
}
