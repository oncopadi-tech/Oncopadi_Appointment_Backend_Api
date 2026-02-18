import { Storage, Bucket } from "@google-cloud/storage";
// import Stream from "stream";
import gcsConfig from "Config/gcs";
import { MultipartFileContract } from "@ioc:Adonis/Core/BodyParser";
import { gcpKeyFile, gcpProjectId } from "Config/app";
import Env from "@ioc:Adonis/Core/Env";
/**
 * Google Cloud Storage
 */
export default class GCS {
  private bucket: Bucket;
  private storage: Storage;

  constructor() {
    this.storage = new Storage({
      projectId: gcpProjectId,
      // keyFilename: JSON.parse(gcpKeyFile),
      //credentials: JSON.parse(gcpKeyFile),
      credentials: {
        client_email: Env.get("GCP_CLIENT_EMAIL"),
        private_key: Env.get("GCP_PRIVATE_KEY").replace(/\\n/g, "\n"),
      },
    });

    this.bucket = this.storage.bucket(gcsConfig.bucketName);
  }

  async uploadFile(file: MultipartFileContract, path = "") {
    const filePath = `${path}/${file.clientName}`;
    const destination = `${gcsConfig.pathPrefix}/${filePath}`;

    const gcsResponse = await this.bucket.upload(file.tmpPath || "", {
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      public: true,
      destination,
      // By setting the option `destination`, you can change the name of the
      // object you are uploading to a bucket.
      metadata: {
        // Enable long-lived HTTP caching headers
        // Use only if the contents of the file will never change
        // (If the contents will change, use cacheControl: 'no-cache')
        cacheControl: "no-cache",
      },
    });

    return { filePath, gcsResponse };
  }

  downloadFile(srcFilename, destination) {
    return this.bucket.file(srcFilename).download({ destination });
  }

  async deleteFile(filePath) {
    const gcsResponse = await this.bucket
      .file(`${gcsConfig.pathPrefix}/${filePath}`)
      .delete();

    return { filePath, gcsResponse };
  }
}
