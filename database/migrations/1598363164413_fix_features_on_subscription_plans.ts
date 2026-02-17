import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class FixFeaturesOnSubscriptionPlans extends BaseSchema {
  protected tableName = 'subscription_plans'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('description')
      table.dropColumn('features')
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.text('features').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('description').nullable()
    })
  }
}
