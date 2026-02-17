import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

const schemaToCreate = {
  title: schema.string.optional(),
  folioNumber: schema.string.optional(),
  bio: schema.string.optional(),
  bankAccountNumber: schema.string.optional(),
  bankAccountName: schema.string.optional(),
  bankName: schema.string.optional(),
  userId: schema.number.optional([
    rules.exists({ table: 'users', column: 'id' })
  ]),
  name: schema.string.optional({}),
  email: schema.string.optional({}, [
    rules.email(),
    rules.unique({ table: 'users', column: 'email' }),
    rules.requiredIfNotExists('userId')
  ]),
  phone: schema.string.optional({}, [
    rules.unique({ table: 'users', column: 'phone' })
  ]),
  address: schema.string.optional(),
  gender: schema.string.optional(),
  dateOfBirth: schema.date.optional(),
  image: schema.file.optional({ size: '2mb' })
}

export default class CreateDoctorValidator {
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
  public schema = schema.create(schemaToCreate)

  public static parsedSchema = schema.create(schemaToCreate)

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
