export interface Media {
  id: number
  date: string
  slug: string
  type: string
  link: string
  title: { rendered: string }
  author: number
  smush: {
    stats: {
      percent: number
      bytes: number
      size_before: number
      size_after: number
      time: number
      api_version: string
      lossy: boolean
      keep_exif: number
    }
    sizes: {
      [key: string]: {
        percent: number
        bytes: number
        size_before: number
        size_after: number
        time: number
      }
    }
  }
  yoast_head: string
  caption: { rendered: string }
  alt_text: string
  media_type: string
  mime_type: string
  media_details: {
    width: number
    height: number
    file: string
    sizes: {
      [key: string]: {
        file: string
        width: string
        height: string
        mime_type: string
        source_url: string
      }
    }
    image_meta: {
      aperture: string | number
      credit: string
      camera: string
      caption: string
      created_timestamp: string | number
      copyright: string
      focal_length: string | number
      iso: string | number
      shutter_speed: string | number
      title: string
      orientation: string | number
    }
  }
  source_url: string
  _links: {
    [key: string]: { embeddable?: boolean; href: string }[]
  }
}

export interface Post {
  id: number
  date: string
  date_gmt: string
  guid: { rendered: string }
  modified: string
  modified_gmt: string
  slug: string
  status: string
  type: string
  link: string
  title: { rendered: string }
  content: {
    rendered: string
    protected: boolean
  }
  excerpt: {
    rendered: string
    protected: boolean
  }
  author: number
  featured_media: number
  comment_status: string
  ping_status: string
  sticky: boolean
  template: string
  format: string
  meta: { spay_email: string }
  categories: number[]
  tags: number[]
  jetpack_featured_media_url: string
  yoast_head: string
  views_count: number
  _links: {
    self: { href: string }[]
    collection: { href: string }[]
    about: { href: string }[]
    author: {
      embeddable: boolean
      href: string
    }[]
    replies: {
      embeddable: boolean
      href: string
    }[]
    'version-history': {
      count: number
      href: string
    }[]
    'predecessor-version': {
      id: number
      href: string
    }[]
    'wp:featuredmedia': {
      embeddable: boolean
      href: string
    }[]
    'wp:attachment': { href: string }[]
    'wp:term': {
      taxonomy: string
      embeddable: boolean
      href: string
    }[]
    curies: { name: string; href: string; templated: boolean }[]
  }
  _embedded: {
    author: {
      id: number
      name: string
      url: string
      description: string
      link: string
      slug: string
      avatar_urls: {
        [key: string]: string
      }
      woocommerce_meta?: {
        activity_panel_inbox_last_read: string
        activity_panel_reviews_last_read: string
        categories_report_columns: string
        coupons_report_columns: string
        customers_report_columns: string
        orders_report_columns: string
        products_report_columns: string
        revenue_report_columns: string
        taxes_report_columns: string
        variations_report_columns: string
        dashboard_sections: string
        dashboard_chart_type: string
        dashboard_chart_interval: string
        dashboard_leaderboard_rows: string
        homepage_stats: string
      }
      yoast_head: string
      _links: {
        self: { href: string }[]
        collection: { href: string }[]
      }
    }[]
    'wp:featuredmedia'?: Media[]
    'wp:term': {
      id: number
      link: string
      name: string
      slug: string
      taxonomy: string
      yoast_head: string
      _links: {
        [key: string]: { href: string; templated: boolean }[]
      }
    }[][]
  }
}
