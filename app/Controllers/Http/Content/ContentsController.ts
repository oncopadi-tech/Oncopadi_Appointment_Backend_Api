import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import WordPress from 'App/Services/WordPress'
import { Media } from 'Contracts/wordpress'

export default class ContentsController {
  public async getPosts({ params, request, response }: HttpContextContract) {
    const wpResponse = await new WordPress().getPosts(
      {
        postType: params.contentType,
        ...request.get()
      },
      false
    )

    var books = new Array<Media>()

    if (params.contentType === 'books') {
      books = await new WordPress().getMedia({
        parent: wpResponse.data.map((post) => post.id)
      })
    }

    return response.json({
      meta: {
        total: Number(wpResponse.headers['x-wp-total'])
      },
      data: params.contentType === 'books' ? books : wpResponse.data
    })
  }
}
