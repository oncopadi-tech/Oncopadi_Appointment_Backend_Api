import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import logger from '@ioc:Adonis/Core/Logger'
import ConsultationStatus from 'App/Models/Consultation/ConsultationStatus'

export default class ConsultationStatusSeeder extends BaseSeeder {
  public static async run() {
    logger.info('seeding consultation statuses')

    await ConsultationStatus.updateOrCreateMany('code', [
      { code: 'created', name: 'Pending' },
      { code: 'cancelled', name: 'Cancelled' },
      { code: 'paid', name: 'Paid' },
      { code: 'confirmed', name: 'Confirmed' },
      { code: 'started', name: 'Started' },
      { code: 'rescheduled', name: 'Rescheduled' },
      { code: 'completed', name: 'Completed' }
    ])

    logger.info('done seeding consultation statuses')
  }
}
