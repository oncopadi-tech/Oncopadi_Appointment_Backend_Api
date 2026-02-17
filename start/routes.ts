/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

// import Route from "@ioc:Adonis/Core/Route";
import Route from "@ioc:Adonis/Core/Route";

/**
 * Auth
 */

Route.get("/", "Auth/OAuthController.index");
Route.post("/register", "Auth/OAuthController.register");
// Route.group(() => {
Route.get("/me", "Auth/OAuthController.me").middleware(["auth"]);

Route.post("oauth/login", "Auth/OAuthController.userLogin");
Route.post("oauth/logout", "Auth/OAuthController.userLogout").middleware([
  "auth",
]);

Route.post("password/send-reset-code", "Auth/PasswordController.sendCode");
Route.post(
  "password/verify-and-reset",
  "Auth/PasswordController.verifyAndReset",
);
Route.post("password/change", "Auth/PasswordController.change").middleware([
  "auth",
]);
// });

/**
 * Chat
 */

Route.group(() => {
  Route.resource("chats", "Chat/ChatsController").apiOnly();

  Route.post(
    "chat-groups/mark-all-as-read/:id",
    "Chat/ChatGroupsController.markAllAsRead",
  ).as("chat_groups.mark-all-as-read");
  Route.resource("chat-groups", "Chat/ChatGroupsController").apiOnly();
}).middleware(["auth", "permission"]);

/**
 * Consultation
 */
Route.group(() => {
  Route.post(
    "consultations/cancel/:id",
    "Consultation/ConsultationsController.cancel",
  ).as("consultations.cancel");
  Route.post(
    "consultations/confirm/:id",
    "Consultation/ConsultationsController.confirm",
  ).as("consultations.confirm");
  Route.post(
    "consultations/join/:id",
    "Consultation/ConsultationsController.join",
  ).as("consultations.join");
  Route.post(
    "consultations/reschedule/:id",
    "Consultation/ConsultationsController.reschedule",
  ).as("consultations.reschedule");
  Route.post(
    "consultations/end/:id",
    "Consultation/ConsultationsController.end",
  ).as("consultations.end");
  Route.post(
    "consultations/leave/:id",
    "Consultation/ConsultationsController.leave",
  ).as("consultations.leave");
  Route.resource(
    "consultations",
    "Consultation/ConsultationsController",
  ).apiOnly();
}).middleware(["auth", "permission"]);

/**
 * Content
 */
// Route.group(() => {
Route.get("content/:contentType", "Content/ContentsController.getPosts");
Route.get("content/download/:post", "Content/ContentsController.download");
// });

/**
 * Community
 */

Route.group(() => {
  Route.post("forums/join/:id", "Community/ForumsController.join").as(
    "forums.join",
  );
  Route.post("forums/leave/:id", "Community/ForumsController.leave").as(
    "forums.leave",
  );
  Route.resource("forums", "Community/ForumsController").apiOnly();

  Route.resource(
    "forum-messages",
    "Community/ForumMessagesController",
  ).apiOnly();
}).middleware(["auth", "permission"]);

/**
 * Finance
 */

Route.resource("subscription-plans", "Finance/SubscriptionPlansController")
  .only(["index", "show"])
  .middleware({
    index: [],
    store: ["auth", "permission"],
    show: [],
    update: ["auth", "permission"],
    destroy: ["auth", "permission"],
  });

Route.group(() => {
  Route.resource("coupons", "Finance/CouponsController").only([
    "index",
    "store",
    "show",
    "destroy",
  ]);

  Route.post("payments/confirm/:id", "Finance/PaymentsController.confirm").as(
    "payments.confirm",
  );
  Route.post(
    "payments/retry/:reference",
    "Finance/PaymentsController.retry",
  ).as("payments.retry");
  Route.resource("payments", "Finance/PaymentsController").only([
    "index",
    "show",
  ]);
}).middleware(["auth", "permission"]);

/**
 * Medical
 */
Route.group(() => {
  Route.resource("hospital-visits", "Medical/HospitalVisitsController").only([
    "index",
    "store",
    "show",
    "update",
    "destroy",
  ]);

  Route.resource(
    "medical-conditions",
    "Medical/MedicalConditionsController",
  ).only(["index", "store", "show", "update", "destroy"]);

  Route.resource("medical-files", "Medical/MedicalFilesController").only([
    "index",
    "store",
    "show",
    "update",
    "destroy",
  ]);

  Route.resource("medications", "Medical/MedicationsController").only([
    "index",
    "store",
    "show",
    "update",
    "destroy",
  ]);

  Route.resource("specialties", "Medical/SpecialtiesController").only([
    "index",
    "show",
  ]);

  Route.resource("symptoms", "Medical/SymptomsController").only([
    "index",
    "store",
    "show",
    "update",
    "destroy",
  ]);
}).middleware(["auth", "permission"]);

/**
 * Miscellaneous
 */
Route.group(() => {
  Route.resource("activities", "Misc/ActivitiesController").only([
    "index",
    "show",
  ]);

  Route.resource("firebase-tokens", "Misc/FirebaseTokensController").only([
    "index",
    "store",
    "show",
  ]);

  Route.post(
    "enquiries/mark-as-seen",
    "Misc/EnquiriesController.markAsSeen",
  ).as("enquiries.mark-as-seen");

  Route.resource("enquiries", "Misc/EnquiriesController").only([
    "index",
    "store",
    "show",
  ]);

  Route.resource("notifications", "Misc/NotificationsController").only([
    "index",
    "show",
  ]);
}).middleware(["auth", "permission"]);

/**
 * People
 */
Route.resource("users", "People/UsersController")
  .apiOnly()
  .middleware({
    index: ["auth", "permission"],
    store: [],
    show: ["auth", "permission"],
    update: ["auth", "permission"],
    destroy: ["auth", "permission"],
  });

Route.group(() => {
  Route.resource("doctors", "People/DoctorsController").apiOnly();
  Route.resource("permissions", "People/PermissionsController").only([
    "index",
    "show",
  ]);
  Route.resource("profile-data", "People/ProfileDataController").apiOnly();
  Route.resource("profile-fields", "People/ProfileFieldsController").only([
    "index",
    "show",
  ]);
  Route.resource("roles", "People/RolesController").only([
    "index",
    "show",
    "update",
  ]);
}).middleware(["auth", "permission"]);

/**
 * Reports
 */
Route.group(() => {
  Route.resource("user-points", "Reports/UserPointsController").only(["index"]);
}).middleware(["auth"]);

/**
 * Shop
 */
Route.group(() => {
  Route.resource("orders", "Shop/OrdersController").only([
    "index",
    "store",
    "show",
  ]);
}).middleware(["auth", "permission"]);
