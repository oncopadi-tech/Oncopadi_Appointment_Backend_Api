import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import logger from "@ioc:Adonis/Core/Logger";
import SubscriptionPlan from "App/Models/Finance/SubscriptionPlan";

export default class SubscriptionPlanSeeder extends BaseSeeder {
  public async run() {
    logger.info("seeding subscription plans");

    await SubscriptionPlan.updateOrCreateMany("code", [
      {
        name: "Basic",
        code: "end-sars",
        price: 5000,
        discount: 0,
        features:
          "One 30 minutes single-timed consultation,One Cancer Specialist Review,Review of Past Medical History and Results,Order Tests and Prescriptions,Referrals,Post Consultation Summary",
      },
      {
        name: "SOAR",
        code: "sebeccly",
        accessCode: "",
        price: 0,
        discount: 0,
        features:
          "One 30 minutes single-timed consultation,One Cancer Specialist Review,Review of Past Medical History and Results,Order Tests and Prescriptions,Referrals,Post Consultation Summary",
      },
      {
        name: "Premium",
        code: "premium",
        price: 10000,
        features:
          "One 60 minutes single-timed consultation,One Cancer Specialist Review,Review of Past Medical History and Results,Order Tests and Prescriptions,Referrals,Post Consultation Summary,72 hrs Follow-Up",
      },
      {
        name: "Concierge Monthly Plan",
        code: "concierge",
        price: 75000,
        numberOfDays: 30,
        features:
          "Unlimited Mutiple Consultations,Daily Access to your Oncologist,Choose your Oncologist,Multi-Cancer Specialist Review (MDT),Medical Report,One home visit per month,+ Premium Benefits",
      },
    ]);

    logger.info("done seeding subscription plans");
  }
}
