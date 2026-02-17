import CreateComment from "App/Repos/Misc/Comment/Create";
import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import User from "App/Models/People/User";
import Activity from "App/Models/Misc/Activity";

export default class Create {
  async handle(title: string, auth?: AuthContract | { user: User }) {
    const comment = await new CreateComment().handle({ title }, auth);

    return await Activity.create({
      commentId: comment.id,
      userId: auth?.user?.id || 0,
    });
  }
}
