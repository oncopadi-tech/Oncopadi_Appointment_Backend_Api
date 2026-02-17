import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import File from 'App/Models/Misc/File'
import GCS from 'App/Services/GCS'
import StoreMedicalFileValidator from 'App/Validators/Medical/StoreMedicalFileValidator'
import MedicalFile from 'App/Models/Medical/MedicalFile'

export default class Create {
  async handle(
    { description, file, userId }: typeof StoreMedicalFileValidator.props,
    auth: AuthContract
  ) {
    if (typeof userId === 'undefined') userId = auth.user?.id || 0

    const uploadedFile = await new GCS().uploadFile(
      file,
      `medical-files/${userId}`
    )

    const storedFile = await File.create({
      name: file.clientName,
      path: uploadedFile.filePath,
      type: file.type,
      createdBy: auth.user?.id
    })

    const medicalFile = await MedicalFile.create({
      description,
      fileId: storedFile.id,
      userId,
      createdBy: auth.user?.id
    })

    return medicalFile
  }
}
