/**
 * Contract source: https://git.io/JfefG
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */

import Consultation from "App/Models/Consultation/Consultation";
import User from "App/Models/People/User";
import ForumMessage from "App/Models/Community/ForumMessage";
import Forum from "App/Models/Community/Forum";
import Coupon from "App/Models/Finance/Coupon";
import SubscriptionPlan from "App/Models/Finance/SubscriptionPlan";
import Notification from "App/Models/Misc/Notification";
import Chat from "App/Models/Chat/Chat";
import ChatGroup from "App/Models/Chat/ChatGroup";
declare module "@ioc:Adonis/Core/Event" {
  /*
  |--------------------------------------------------------------------------
  | Define typed events
  |--------------------------------------------------------------------------
  |
  | You can define types for events inside the following interface and
  | AdonisJS will make sure that all listeners and emit calls adheres
  | to the defined types.
  |
  | For example:
  |
  | interface EventsList {
  |   'new:user': UserModel
  | }
  |
  | Now calling `Event.emit('new:user')` will statically ensure that passed value is
  | an instance of the the UserModel only.
  |
  */
  interface EventsList {
    "password/reset-code-generated": {
      user: User;
      resetCode: string;
      type: string;
    };

    // chat
    "chat/sent": {
      chat: Chat;
      chatGroup: ChatGroup;
      user: User;
    };

    // consultation
    "consultation/paid": {
      consultation: Consultation;
      user: User;
    };
    "consultation/confirmed": {
      consultation: Consultation;
      user: User;
    };
    "consultation/joined": {
      consultation: Consultation;
      user: User;
    };
    "consultation/started": {
      consultation: Consultation;
      user: User;
    };
    "consultation/rescheduled": {
      consultation: Consultation;
      user: User;
    };
    "consultation/ended": {
      consultation: Consultation;
      user: User;
    };

    // community
    "forum-message/created": {
      forumMessage: ForumMessage;
      forum: Forum;
      user: User;
    };

    //finance
    "coupons/genrated": {
      coupons: Coupon[];
      subscriptionPlan: SubscriptionPlan;
      user: User;
    };

    //miscelleneous
    "notifications/created": Notification;

    // people
    "user/created": { password: string; user: User };
    "user/last-seen-set": { user: User };
  }
}
