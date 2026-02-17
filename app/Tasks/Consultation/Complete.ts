// import { BaseTask } from 'adonis5-scheduler/build'
import { BaseTask } from "adonis5-scheduler/build";
import logger from "@ioc:Adonis/Core/Logger";
import Database from "@ioc:Adonis/Lucid/Database";
import Consultation from "App/Models/Consultation/Consultation";
import End from "App/Repos/Consultation/Consultation/End";
import User from "App/Models/People/User";
import oncopadiConfig from "Config/oncopadi";

export default class Complete extends BaseTask {
  public static get schedule() {
    return "* * * * * *";
  }
  /**
   * Set enable use .lock file for block run retry task
   * Lock file save to `build/tmpTaskLock`
   */
  public static get useLock() {
    return false;
  }

  public async handle() {
    const presentConsultationsQuery = Database.from("consultation_attendances")
      .whereNotNull("joined_at")
      .select("consultation_id");

    const consultations = await Consultation.query()
      .apply((scopes) => scopes.statuses(["confirmed", "started"]))
      .whereIn("id", presentConsultationsQuery);

    const user = await User.query()
      .where("email", oncopadiConfig.admin.email)
      .preload("roles", (query) => query.preload("permissions"))
      .firstOrFail();

    for (const consultation of consultations) {
      try {
        await new End().handle(consultation.id, { user });
      } catch (error) {
        logger.error(error);
      }
    }

    logger.info("done completing tasks");
  }
}
