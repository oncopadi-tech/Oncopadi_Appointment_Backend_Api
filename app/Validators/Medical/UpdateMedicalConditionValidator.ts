import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

const validations = {
  diagnosis: schema.string.optional(),
  centre: schema.string.optional(),
  date: schema.date.optional(),
  ageAtDiagnosis: schema.number.optional(),
  histology: schema.string.optional(),
  cancerType: schema.string.optional(),
  comorbidity: schema.string.optional(),
  stage: schema.string.optional(),
  grade: schema.string.optional()
}

export default class UpdateMedicalConditionValidator {
  constructor(private ctx: HttpContextContract) {}

  /**
   * Defining a schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create(validations)

  public static props = schema.create(validations).props

  /**
   * The `schema` first gets compiled to a reusable function and then that compiled
   * function validates the data at runtime.
   *
   * Since, compiling the schema is an expensive operation, you must always cache it by
   * defining a unique cache key. The simplest way is to use the current request route
   * key, which is a combination of the route pattern and HTTP method.
   */
  public cacheKey = this.ctx.routeKey

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   */
  public messages = {}
}
