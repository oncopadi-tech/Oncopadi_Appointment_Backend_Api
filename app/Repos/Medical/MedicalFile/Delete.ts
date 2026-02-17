import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import MedicalFile from 'App/Models/Medical/MedicalFile'
import GCS from 'App/Services/GCS'

export default class Delete {
  async handle(id, auth: AuthContract) {
    var medicalFile = await MedicalFile.query()
      .where('id', id)
      .preload('file')
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    await new GCS().deleteFile(medicalFile.file.path)

    await medicalFile.file.delete()

    await medicalFile.delete()

    return medicalFile
  }
}
