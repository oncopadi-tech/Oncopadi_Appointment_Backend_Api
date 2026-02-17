import User from "App/Models/People/User";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { Exception } from "@poppinss/utils";
import CreateActivity from "App/Repos/Misc/Activity/Create";
import SetLastSeen from "App/Repos/People/User/SetLastSeen";
import GetUnReadMessages from "App/Repos/Chats/Chat/GetUnreadMessages";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Database from "@ioc:Adonis/Lucid/Database";
import Hash from "@ioc:Adonis/Core/Hash";
export default class OAuthController {
  public async index({ response }: HttpContextContract) {
    return response.json({
      message: "Hi! Spread Peace :)",
    });
  }

  public async register({ request, response }: HttpContextContract) {
    let validate = schema.create({
      name: schema.string(),
      email: schema.string([
        rules.unique({ table: "users", column: "email" }),
        rules.email(),
      ]),
      phone: schema.string([rules.minLength(11), rules.maxLength(15)]),
      password: schema.string(),
      address: schema.string(),
      date_of_birth: schema.date({ format: "yyyy-MM-dd" }),
      username: schema.string(),
    });

    let validated = await request.validate({ schema: validate });
    // let hashpassword = await Hash.make(validated.password);
    let user = await User.create({
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      password: validated.password,
      address: validated.address,
      dateOfBirth: validated.date_of_birth,
      active: true,
      gender: "Male",
      username: validated.username,
    });
    await Database.table("role_user").insert({
      role_id: 1,
      user_id: user.id,
    });

    return response.status(200).json({ message: "user created" });
  }

  public async userLogin({ request, auth }: HttpContextContract) {
    const validate = schema.create({
      username: schema.string(),
      password: schema.string(),
    });
    let validated = await request.validate({ schema: validate });
    // const token = await auth
    //   .use("api")
    //   .attempt(validated.username, validated.password);

    let user = await User.query()
      .where((query) => {
        query
          .where("email", validated.username)
          .orWhere("phone", validated.username);
      })
      .where("active", true)
      .first();

    if (!user) {
      throw new Exception("Invalid credentials or account suspended", 401);
    }

    if (!(await Hash.verify(user.password, validated.password.trim()))) {
      throw new Exception("Invalid credentials", 401);
    }

    const token = await auth.use("api").login(user, {
      expiresIn: "6hours",
    });
    await new CreateActivity().handle("You logged in", { user });

    return token.toJSON();
  }

  public async userLogout({ auth, response }) {
    await new CreateActivity().handle("You logged out", auth);

    await auth.use("api").logout();

    return response.json({
      message: "user logged out",
    });
  }

  public async me({ request, response, auth }: HttpContextContract) {
    const { relationships = [], getUnReadMessages = true } = request.get();

    var query = User.query().where("id", auth.user ? auth.user.id : 0);

    for (const relationship of relationships) {
      if (relationship === "roles.permissions") {
        query.preload("roles", (query) => query.preload("permissions"));
      } else {
        query.preload(relationship);
      }
    }

    await SetLastSeen.handle(auth);

    const user = await query.firstOrFail();

    var responseObject: { [key: string]: any } = { user };

    if (getUnReadMessages) {
      responseObject.unReadMessages = await GetUnReadMessages.handle(user);
      responseObject.user = {
        ...user.serialize(),
        unReadMessages: responseObject.unReadMessages,
      };
    }

    return response.json(responseObject);
  }
}
