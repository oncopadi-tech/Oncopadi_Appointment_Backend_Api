import Route from '@ioc:Adonis/Core/Route'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import User from 'App/Models/People/User'
import gcsConfig from 'Config/gcs'

export const getCurrentRoute = (request: RequestContract) => {
  return Route.match(request.url(), request.method())?.route
}

export const slugify = (str, separator = '-') => {
  str = str.trim()
  str = str.toLowerCase()

  // remove accents, swap ñ for n, etc
  const from = 'åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;'
  const to = 'aaaaaaeeeeiiiioooouuuunc------'

  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  return str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes
    .replace(/^-+/, '') // trim - from start of text
    .replace(/-+$/, '') // trim - from end of text
    .replace(/-/g, separator)
}

export const getGcsPublicUrl = (filePath) =>
  !filePath
    ? null
    : `https://storage.googleapis.com/${gcsConfig.bucketName}/${gcsConfig.pathPrefix}/${filePath}`

export const getRoleCodes = (user?: User) =>
  user?.roles.map((role) => role.code) || []

export const getLogStatusCodes = (logs: Array<{ status: { code: string } }>) =>
  logs.reduce((all, log) => all.concat([log.status.code]), new Array<string>())

export const namePermission = (entity: string, action: string) => {
  action = action
    .replace('index', 'list')
    .replace('show', 'retrieve single')
    .replace('destroy', 'delete')

  entity = entity.replace('-', ' ').replace('_', ' ')

  return `${action} ${entity}`
}

export const toMoney = (value = 0, currency = 'NGN') => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol'
  }).format(value)
}
