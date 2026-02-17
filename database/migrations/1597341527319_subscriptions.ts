import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Subscriptions extends BaseSchema {
  protected tableName = 'subscriptions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.dateTime('starts_at').nullable()
      table.dateTime('ends_at').nullable()
      table.integer('consultations_left').defaultTo(0)
      table
        .integer('subscription_plan_id')
        .unsigned()
        .references('id')
        .inTable('subscription_plans')
        .nullable()
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .nullable()
        .onDelete('CASCADE')
      table
        .integer('created_by')
        .unsigned()
        .references('id')
        .inTable('users')
        .nullable()
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
