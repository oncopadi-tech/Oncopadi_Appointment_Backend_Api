import logger from '@ioc:Adonis/Core/Logger'
import Axios, { AxiosInstance, AxiosResponse } from 'axios'
import { cmsUrl } from 'Config/app'
import { Media, Post } from 'Contracts/wordpress'

export default class WordPress {
  public $axios: AxiosInstance

  constructor() {
    this.$axios = Axios.create({
      baseURL: cmsUrl
    })
  }

  public async createComment({ comment }) {
    const response = this.$axios.post('wp-json/wp/v2/comments', comment)
    return response
  }

  public getAuthorAvatar(avatarUrls) {
    return avatarUrls['96']
      ? avatarUrls['96']
      : 'https://via.placeholder.com/500x500'
  }

  public async getCategories({ perPage = 20, search = null }) {
    try {
      const response = await this.$axios.get(
        'wp-json/wp/v2/categories?_embed',
        {
          params: {
            per_page: perPage,
            search
          }
        }
      )
      return response.data
    } catch (error) {
      logger.error(error)
    }
  }

  public async getMedia(
    { parent, page = 1, perPage = 10, search = null },
    dataOnly = true
  ): Promise<Media[] & AxiosResponse<Media[]>> {
    const response = await this.$axios.get('wp-json/wp/v2/media', {
      params: {
        parent: typeof parent === 'string' ? parent : parent.join(','),
        page,
        per_page: perPage,
        search
      }
    })

    return !dataOnly ? response : response.data
  }

  public async getPosts(
    {
      postType = 'posts',
      after = null,
      before = null,
      categories = null,
      page = 1,
      perPage = 10,
      search = null,
      tags = null
    },
    dataOnly = true
  ): Promise<Post[] & AxiosResponse<Post[]>> {
    const response = await this.$axios.get(`wp-json/wp/v2/${postType}?_embed`, {
      params: {
        after,
        before,
        categories,
        page,
        per_page: perPage,
        search,
        tags
      }
    })

    return !dataOnly ? response : response.data
  }

  public async getTags({ perPage = 20, search = null }) {
    try {
      const response = await this.$axios.get('wp-json/wp/v2/tags?_embed', {
        params: {
          per_page: perPage,
          search
        }
      })
      return response.data
    } catch (error) {
      logger.error(error)
    }
  }

  public getWPMediaUrl(post) {
    try {
      const imageUrl = post._embedded['wp:featuredmedia']
        ? post._embedded['wp:featuredmedia'][0].media_details.sizes.full
          ? post._embedded['wp:featuredmedia'][0].media_details.sizes.full
              .source_url
          : 'https://via.placeholder.com/500x500'
        : 'https://via.placeholder.com/500x500'
      return imageUrl
    } catch (err) {
      return 'https://via.placeholder.com/500x500'
    }
  }
}
