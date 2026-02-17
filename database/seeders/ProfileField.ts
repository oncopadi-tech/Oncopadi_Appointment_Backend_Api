import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import ProfileField from "App/Models/People/ProfileField";
import Role from "App/Models/People/Role";
import Database from "@ioc:Adonis/Lucid/Database";
import logger from "@ioc:Adonis/Core/Logger";

export default class ProfileFieldSeeder extends BaseSeeder {
  public async run() {
    logger.info("seeding profile fields");

    const existingFields = await ProfileField.all();
    const roles = await Role.all();

    const fields = [
      {
        name: "Education Level",
        code: "education-level",
        category: "bio",
        roles: ["administrator", "patient", "doctor"],
      },
      {
        name: "Nationality",
        code: "nationality",
        category: "bio",
        roles: ["administrator", "patient", "doctor"],
      },
      {
        name: "Ethnicity",
        code: "ethnicity",
        category: "bio",
        roles: ["administrator", "patient", "doctor"],
      },
      {
        name: "Marital Status",
        code: "marital-status",
        category: "bio",
        roles: ["administrator", "patient", "doctor"],
      },
      {
        name: "Religion",
        code: "religion",
        category: "bio",
        roles: ["administrator", "patient", "doctor"],
      },
      {
        name: "Occupation",
        code: "occupation",
        category: "bio",
        roles: ["administrator", "patient", "doctor"],
      },
      {
        name: "Occupation",
        code: "occupation",
        category: "bio",
        roles: ["administrator", "patient", "doctor"],
        active: false,
      },
      {
        name: "Caregiver Name",
        code: "caregiver-name",
        category: "medical",
        roles: ["patient"],
      },
      {
        name: "Caregiver Phone",
        code: "caregiver-phone",
        category: "medical",
        roles: ["patient"],
      },
      {
        name: "Caregiver Email",
        code: "caregiver-email",
        category: "medical",
        roles: ["patient"],
      },
      {
        name: "Diagnosis/Stage",
        code: "diagnosis-and-stage",
        category: "medical",
        roles: ["patient"],
      },
      {
        name: "Date of Diagnosis",
        code: "date-of-diagnosis",
        category: "medical",
        roles: ["patient"],
      },
      {
        name: "Centre where diagnosis was made",
        code: "diagnosis-centre",
        category: "medical",
        roles: ["patient"],
      },
      {
        name: "Name of Managing Doctor",
        code: "managing-doctor-name",
        category: "medical",
        roles: ["patient"],
      },
      {
        name: "Weight",
        code: "weight",
        category: "medical",
        roles: ["patient"],
      },
      {
        name: "Height",
        code: "height",
        category: "medical",
        roles: ["patient"],
      },
      {
        name: "BMI",
        code: "bmi",
        category: "medical",
        roles: ["patient"],
      },
      {
        name: "Blood Group",
        code: "blood-group",
        category: "medical",
        roles: ["patient"],
      },
      {
        name: "Genotype",
        code: "genotype",
        category: "medical",
        roles: ["patient"],
      },
      {
        name: "History of Hypertension",
        code: "history-of-hypertension",
        category: "medical",
        roles: ["patient"],
      },
      {
        name: "History of Asthma",
        code: "history-of-asthma",
        category: "medical",
        roles: ["patient"],
      },
      {
        name: "History of Asthma",
        code: "history-of-asthma",
        category: "medical",
        roles: ["patient"],
      },
    ];

    const profileFields = await ProfileField.updateOrCreateMany(
      "code",
      fields.map((field) => ({
        name: field.name,
        code: field.code,
        category: field.category,
      })),
    );

    const fieldRoles = fields
      .filter(
        (field) =>
          !existingFields.find(
            (existingField) => field.code === existingField.code,
          ),
      )
      .reduce((total, field) => {
        const createdField = profileFields.find(
          (createdField) => field.code === createdField.code,
        );

        const roleIds = field.roles.map(
          (code) => roles.find((role) => role.code === code)?.id,
        );

        return total.concat(
          roleIds.map((role_id) => ({
            role_id,
            profile_field_id: createdField?.id,
          })),
        );
      }, new Array())
      .filter((fieldRole) => fieldRole.role_id && fieldRole.profile_field_id);

    await Database.table("profile_field_role").multiInsert(fieldRoles);

    logger.info("done seeding profile fields");
  }
}
