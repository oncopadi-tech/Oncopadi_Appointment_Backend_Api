import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import RoleSeeder from "./Role";
import EntitySeeder from "./Entity";
import PermissionSeeder from "./Permission";
import CreateAdminSeeder from "./CreateAdmin";
import ConsultationStatusSeeder from "./ConsultationStatus";
import PaymentMethodSeeder from "./PaymentMethod";
import SubscriptionPlanSeeder from "./SubscriptionPlan";
import ProfileFieldSeeder from "./ProfileField";
import SpecialtySeeder from "./Specialty";

export default class DatabaseSeeder extends BaseSeeder {
  public async run() {
    await new RoleSeeder(this.client).run();
    await new EntitySeeder(this.client).run();
    await new PermissionSeeder(this.client).run();
    await new ConsultationStatusSeeder(this.client).run();
    await new CreateAdminSeeder(this.client).run();
    await new PaymentMethodSeeder(this.client).run();
    await new SubscriptionPlanSeeder(this.client).run();
    await new ProfileFieldSeeder(this.client).run();
    await new SpecialtySeeder(this.client).run();
  }
}
