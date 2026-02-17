import Event from "@ioc:Adonis/Core/Event";
import passwordResetConfig from "Config/passwordReset";
import { Exception } from "@poppinss/utils";
import PasswordReset from "App/Models/Auth/PasswordReset";
import User from "App/Models/People/User";
import CreateActivity from "App/Repos/Misc/Activity/Create";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
export default class PasswordController {
  async sendCode({ request, response }: HttpContextContract) {
    const validate = schema.create({
      email: schema.string.optional({}, [
        rules.exists({ table: "users", column: "email" }),
        rules.requiredWhen("type", "=", "email"),
      ]),
      phone: schema.string.optional({}, [
        rules.exists({ table: "users", column: "phone" }),
        rules.requiredWhen("type", "=", "phone"),
      ]),
      type: schema.string(),
    });
    let validated = await request.validate({ schema: validate });

    const user = await User.query()
      .where("email", validated.email ? validated.email : "")
      .orWhere("phone", validated.phone ? validated.phone : "")
      .firstOrFail();

    var resetCode;

    do {
      resetCode = Math.floor(1000 + Math.random() * 9000).toString();
    } while ((await PasswordReset.findBy("code", resetCode)) !== null);

    const oldPasswordResets = await PasswordReset.query().where(
      "user_id",
      user.id,
    );

    for (const oldPasswordReset of oldPasswordResets)
      await oldPasswordReset.delete();

    PasswordReset.create({
      userId: user.id,
      code: resetCode,
    });
    let type = validated.type;
    Event.emit("password/reset-code-generated", { user, resetCode, type });

    await new CreateActivity().handle("You attempted a password reset", {
      user,
    });

    return response.json({
      status: true,
      message: `a password reset code has been sent to your registered ${type}`,
    });
  }

  async verifyAndReset({ request, response, auth }: HttpContextContract) {
    const validate = schema.create({
      code: schema.string(),
      password: schema.string(),
    });
    let validated = await request.validate({ schema: validate });

    const passwordReset = await PasswordReset.findByOrFail(
      "code",
      validated.code,
    );

    if (
      passwordReset.createdAt.diffNow().milliseconds >
      passwordResetConfig.timeToExpiry
    ) {
      passwordReset.delete();
      throw new Exception("reset code has expired", 400);
    }

    const user = await User.findByOrFail("id", passwordReset.userId);

    user.password = validated.password;
    await user.save();

    await passwordReset.delete();

    const token = await auth.use("api").login(user);

    await new CreateActivity().handle("Your password reset was successful", {
      user,
    });

    return response.json(token);
  }

  async change({ request, response, auth }: HttpContextContract) {
    const validate = schema.create({
      password: schema.string(),
    });
    let validated = await request.validate({ schema: validate });

    var user = await User.findOrFail(auth.user?.id);
    user.password = validated.password;
    await user.save();

    await new CreateActivity().handle("You changed your password", {
      user,
    });

    return response.json({
      status: true,
      message: "password change successful",
    });
  }
}
