import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import logger from '@ioc:Adonis/Core/Logger'
import Role from 'App/Models/People/Role'

export default class RoleSeeder extends BaseSeeder {
  public static async run() {
    logger.info('seeding roles')

    await Role.updateOrCreateMany('code', [
      {
        name: 'Adminsitrator',
        code: 'administrator'
      },
      {
        name: 'Doctor',
        code: 'doctor'
      },
      {
        name: 'Patient',
        code: 'patient'
      }
    ])

    logger.info('done seeding roles')
  }
}
