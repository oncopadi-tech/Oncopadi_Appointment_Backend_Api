import Comment from 'App/Models/Misc/Comment'

export default class Update {
  async handle(id, data: { title?: string; text?: string }) {
    var comment = await Comment.findOrFail(id)

    for (const key in data) {
      if (['title', 'text'].includes(key))
        comment[key] = typeof data[key] !== 'undefined' ? data[key] : data[key]
    }
    await comment.save()

    return comment
  }
}
