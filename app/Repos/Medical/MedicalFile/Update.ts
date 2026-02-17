import MedicalFile from 'App/Models/Medical/MedicalFile'
import GCS from 'App/Services/GCS'
import logger from '@ioc:Adonis/Core/Logger'
import UpdateMedicalFileValidator from 'App/Validators/Medical/UpdateMedicalFileValidator'

export default class Update {
  async handle(
    id,
    { description, file }: typeof UpdateMedicalFileValidator.props,
    auth
  ) {
    var medicalFile = await MedicalFile.query()
      .where('id', id)
      .preload('file')
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    medicalFile.description =
      typeof description !== 'undefined' ? description : medicalFile.description

    if (file) {
      try {
        await new GCS().deleteFile(medicalFile.file.path)
        medicalFile.file.path = (
          await new GCS().uploadFile(
            file,
            `medical-files/${medicalFile.userId}`
          )
        ).filePath
        medicalFile.file.name = file.clientName
        await medicalFile.file.save()
      } catch (error) {
        logger.error(error)
      }
    }

    await medicalFile.save()

    return medicalFile
  }
}
