import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SubscriptionPlans extends BaseSchema {
  protected tableName = 'subscription_plans'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').nullable()
      table.string('code').nullable()
      table.string('access_code').nullable()
      table.string('description').nullable()
      table.string('features').nullable()
      table.integer('number_of_days').defaultTo(1)
      table.float('price', 20, 2).nullable()
      table.string('currency', 10).defaultTo('NGN')
      table.float('discount', 20, 2).defaultTo(0)
      table.boolean('active').defaultTo(true)
      table
        .integer('created_by')
        .unsigned()
        .references('id')
        .inTable('users')
        .nullable()
        .onDelete('CASCADE')
      table.timestamps()
    })

    this.schema.alterTable('consultations', (table) => {
      table
        .integer('subscription_plan_id')
        .unsigned()
        .references('id')
        .inTable('subscription_plans')
        .nullable()
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.alterTable('consultations', (table) => {
      table.dropForeign(['subscription_plan_id'])
      table.dropColumn('subscription_plan_id')
    })

    this.schema.dropTable(this.tableName)
  }
}
