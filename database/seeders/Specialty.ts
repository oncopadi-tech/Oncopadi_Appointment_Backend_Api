import logger from "@ioc:Adonis/Core/Logger";
import Database from "@ioc:Adonis/Lucid/Database";
import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Specialty from "App/Models/Medical/Specialty";

export default class SpecialtySeeder extends BaseSeeder {
  public async run() {
    logger.info("seeding specialties");
    await Specialty.createMany([
      { name: "Breast Cancer", code: "breast-cancer", active: false },
      { name: "Cervical Cancer", code: "cervical-cancer", active: false },
      { name: "Prostate Cancer", code: "prostate-cancer", active: false },
      { name: "Liver Cancer", code: "liver-cancer", active: false },
      { name: "Colorectal Cancer", code: "colorectal-cancer", active: false },
      { name: "Thyroid Cancer", code: "thyroid-cancer", active: false },
      { name: "Renal Cancer", code: "renal-cancer", active: false },
      { name: "Other Cancer", code: "other", active: false },
    ]);

    // await Specialty.create({
    //   name: "Breast Cancer",
    //   code: "breast-cancer",
    //   active: false,
    // });

    logger.info("done seeding specialties");
  }
}
