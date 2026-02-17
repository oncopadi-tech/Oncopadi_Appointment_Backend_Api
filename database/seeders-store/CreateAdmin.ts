import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import logger from '@ioc:Adonis/Core/Logger'
import Create from 'App/Repos/People/User/Create'
import oncopadiConfig from 'Config/oncopadi'
import User from 'App/Models/People/User'

export default class CreateAdminSeeder extends BaseSeeder {
  public static async run() {
    logger.info('seeding admin user')
    const existingAdmin = await User.findBy('email', oncopadiConfig.admin.email)

    if (!existingAdmin)
      await new Create().handle(oncopadiConfig.admin, undefined, true)

    logger.info('done seeding admin user')
  }
}
