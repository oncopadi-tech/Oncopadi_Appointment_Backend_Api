import { orderStatuses } from 'Config/woocommerce'

export interface Billing {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  address_1?: string
  country?: string
  address_2?: string
  city?: string
  state?: string
  company?: string
  postcode?: string
}

export interface Customer {
  id: number
  date_created: string
  date_created_gmt: string
  date_modified: string
  date_modified_gmt: string
  email: string
  first_name: string
  last_name?: string
  role?: string
  username?: string
  billing: Billing
  shipping: Billing
  is_paying_customer: boolean
  avatar_url?: string
  meta_data?: Array<any>
  _links: Links
}

export interface CreateLineItem {
  product_id: number
  quantity: number
  variation_id: number
}

export interface LineItem extends CreateLineItem {
  id: number
  name: string
  tax_class: string
  subtotal: number
  subtotal_tax: number
  total: number
  total_tax: number
  taxes: Array<{
    id: number
    total: number
    subtotal: number
  }>
  meta_data?: Array<{
    id: number
    key: string
    value: string
  }>
  sku: string
  price: number
}

export interface Links {
  self: Array<{
    href: string
  }>
  collection: Array<{
    href: string
  }>
}

export interface CreateOrder {
  payment_method: string
  payment_method_title: string
  set_paid: boolean
  billing: Billing
  shipping: Billing
  line_items: Array<CreateLineItem>
  shipping_lines?: Array<{
    id?: number
    method_title: string
    method_id: string
    total: string
    total_tax?: number
    taxes?: Array<any>
    meta_data?: Array<any>
  }>
}

export interface Order extends CreateOrder {
  id?: number
  parent_id?: number
  number?: number
  order_key?: string
  created_via?: string
  version?: string
  status?: typeof orderStatuses[number]
  currency?: string
  date_created?: string
  date_created_gmt?: string
  date_modified?: string
  date_modified_gmt?: string
  discount_total?: number
  discount_tax?: number
  shipping_total?: number
  shipping_tax?: number
  cart_tax?: number
  total?: number
  total_tax?: number
  prices_include_tax?: boolean
  customer_id?: number
  customer_ip_address?: string
  customer_user_agent?: string
  customer_note?: string
  transaction_id?: number | string
  date_paid?: string
  date_paid_gmt?: string
  date_completed?: string
  date_completed_gmt?: string
  cart_hash?: string
  meta_data?: Array<any>
  tax_lines?: Array<{
    id: number
    rate_code: string
    rate_id: number
    label: string
    compound: boolean
    tax_total: string
    shipping_tax_total: number
    meta_data?: Array<any>
  }>
  fee_lines?: Array<any>
  coupon_lines?: Array<any>
  refunds?: Array<any>
  _links: Links
}
