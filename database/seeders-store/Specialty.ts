import logger from "@ioc:Adonis/Core/Logger";
import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Specialty from "App/Models/Medical/Specialty";

export default class SpecialtySeeder extends BaseSeeder {
  public static async run() {
    logger.info("seeding specialties");

    await Specialty.updateOrCreateMany("code", [
      { name: "Breast Cancer", code: "breast-cancer", active: false },
      { name: "Cervical Cancer", code: "cervical-cancer", active: false },
      { name: "Prostate Cancer", code: "prostate-cancer", active: false },
      { name: "Liver Cancer", code: "liver-cancer", active: false },
      { name: "Colorectal Cancer", code: "colorectal-cancer", active: false },
      { name: "Thyroid Cancer", code: "thyroid-cancer", active: false },
      { name: "Renal Cancer", code: "renal-cancer", active: false },
      { name: "Other Cancer", code: "other", active: false },
    ]);

    logger.info("done seeding specialties");
  }
}
