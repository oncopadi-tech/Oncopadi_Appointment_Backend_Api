import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class CtxExtend {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    ctx['validator'] = {
      schema,
      rules,
      validate: async (validatedSchema) => {
        return await ctx.request.validate({
          schema: schema.create(validatedSchema)
        })
      }
    }
    await next()
  }
}
