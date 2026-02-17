import Axios, { AxiosInstance } from "axios";
import fcmConfig from "Config/fcm";
import FirebaseToken from "App/Models/Misc/FirebaseToken";
// import { logger } from '@adonisjs/ace'
import Logger from "@ioc:Adonis/Core/Logger";

export default class Fcm {
  public $axios: AxiosInstance;
  public $app: string;

  public constructor($app) {
    this.$app = $app;
    this.createAxiosInstance();
  }

  private createAxiosInstance() {
    this.$axios = Axios.create({
      baseURL: fcmConfig.url,
      headers: {
        common: {
          Authorization: `key=${fcmConfig[this.$app].serverKey}`,
          "Content-Type": "application/json",
        },
      },
    });
  }

  /**
   * async send
   */
  public async send(options: {
    token: FirebaseToken;
    data?: object;
    title?: string;
    body?: string;
    image?: string;
  }) {
    const { token, data, title, body, image } = options;

    if (!token) return;

    try {
      var fcmData: any = {
        to: token.token,
        // content_available: true,
        direct_book_ok: true,
        data,
      };

      if (title) {
        fcmData.notification = {
          title,
          body: body?.replace(/<[^>]*>?/gm, ""),
          image,
        };
      }

      const response = await this.$axios.post("/fcm/send", fcmData);

      Logger.info("fcm message sent");

      return response;
    } catch (error) {
      Logger.error(error);
    }
  }
}
