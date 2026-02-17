import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import logger from "@ioc:Adonis/Core/Logger";
import PaymentMethod from "App/Models/Finance/PaymentMethod";

export default class PaymentMethodSeeder extends BaseSeeder {
  public async run() {
    logger.info("seeding payment methods");

    await PaymentMethod.updateOrCreateMany("code", [
      { name: "Cash", code: "cash" },
      { name: "Paystack", code: "paystack" },
    ]);

    logger.info("done seeding payment methods");
  }
}
