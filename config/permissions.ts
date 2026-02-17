const permissionsConfig = {
  /**
   * Chat
   */
  chats: {
    index: ['administrator', 'doctor', 'patient'],
    store: ['administrator', 'doctor', 'patient'],
    show: ['administrator', 'doctor', 'patient'],
    update: ['administrator', 'doctor', 'patient'],
    destroy: ['administrator', 'doctor', 'patient']
  },
  chat_groups: {
    index: ['administrator', 'doctor', 'patient'],
    store: ['administrator', 'doctor', 'patient'],
    show: ['administrator', 'doctor', 'patient'],
    update: ['administrator', 'doctor', 'patient'],
    destroy: ['administrator', 'doctor', 'patient'],
    'mark-all-as-read': ['administrator', 'doctor', 'patient']
  },

  /**
   * Consultation
   */
  consultations: {
    index: ['administrator', 'doctor', 'patient'],
    store: ['administrator', 'doctor', 'patient'],
    show: ['administrator', 'doctor', 'patient'],
    update: ['administrator', 'doctor', 'patient'],
    destroy: ['administrator'],
    cancel: ['administrator', 'doctor', 'patient'],
    confirm: ['administrator'],
    join: ['administrator', 'doctor', 'patient'],
    reschedule: ['administrator', 'doctor'],
    leave: ['administrator', 'doctor', 'patient'],
    end: ['administrator']
  },

  /**
   * Community
   */
  forums: {
    index: ['administrator', 'doctor', 'patient'],
    store: ['administrator'],
    show: ['administrator', 'doctor', 'patient'],
    update: ['administrator'],
    destroy: ['administrator'],
    join: ['administrator', 'doctor', 'patient'],
    leave: ['administrator', 'doctor', 'patient']
  },
  forum_messages: {
    index: ['administrator', 'doctor', 'patient'],
    store: ['administrator', 'doctor', 'patient'],
    show: ['administrator', 'doctor', 'patient'],
    update: ['administrator', 'doctor', 'patient'],
    destroy: ['administrator', 'doctor', 'patient']
  },

  /**
   * Finance
   */
  coupons: {
    index: ['administrator'],
    store: ['administrator'],
    show: ['administrator'],
    destroy: ['administrator']
  },
  payments: {
    index: ['administrator', 'doctor', 'patient'],
    show: ['administrator', 'doctor', 'patient'],
    confirm: ['administrator', 'doctor', 'patient'],
    retry: ['administrator', 'doctor', 'patient']
  },

  /**
   * Medical
   */
  hospital_visits: {
    index: ['administrator', 'doctor', 'patient'],
    store: ['administrator', 'doctor', 'patient'],
    show: ['administrator', 'doctor', 'patient'],
    update: ['administrator', 'doctor', 'patient'],
    destroy: ['administrator', 'doctor', 'patient']
  },
  medical_conditions: {
    index: ['administrator', 'doctor', 'patient'],
    store: ['administrator', 'doctor', 'patient'],
    show: ['administrator', 'doctor', 'patient'],
    update: ['administrator', 'doctor', 'patient'],
    destroy: ['administrator', 'doctor', 'patient']
  },
  medical_files: {
    index: ['administrator', 'doctor', 'patient'],
    store: ['administrator', 'doctor', 'patient'],
    show: ['administrator', 'doctor', 'patient'],
    update: ['administrator', 'doctor', 'patient'],
    destroy: ['administrator', 'doctor', 'patient']
  },
  medications: {
    index: ['administrator', 'doctor', 'patient'],
    store: ['administrator', 'doctor', 'patient'],
    show: ['administrator', 'doctor', 'patient'],
    update: ['administrator', 'doctor', 'patient'],
    destroy: ['administrator', 'doctor', 'patient']
  },
  specialties: {
    index: ['administrator', 'doctor', 'patient'],
    show: ['administrator', 'doctor', 'patient']
  },
  symptoms: {
    index: ['administrator', 'doctor', 'patient'],
    store: ['administrator', 'doctor', 'patient'],
    show: ['administrator', 'doctor', 'patient'],
    update: ['administrator', 'doctor', 'patient'],
    destroy: ['administrator', 'doctor', 'patient']
  },

  /**
   * Miscellaneous
   */
  activities: {
    index: ['administrator', 'doctor', 'patient'],
    show: ['administrator', 'doctor', 'patient']
  },
  firebase_tokens: {
    index: ['administrator', 'doctor', 'patient'],
    store: ['administrator', 'doctor', 'patient'],
    show: ['administrator', 'doctor', 'patient']
  },
  enquiries: {
    index: ['administrator', 'doctor', 'patient'],
    store: ['administrator', 'doctor', 'patient'],
    show: ['administrator', 'doctor', 'patient'],
    'mark-as-seen': ['administrator', 'doctor', 'patient']
  },
  notifications: {
    index: ['administrator', 'doctor', 'patient'],
    show: ['administrator', 'doctor', 'patient']
  },

  /**
   * People
   */
  doctors: {
    index: ['administrator', 'doctor', 'patient'],
    store: ['administrator', 'doctor'],
    show: ['administrator', 'doctor', 'patient'],
    update: ['administrator', 'doctor', 'patient'],
    destroy: ['administrator', 'doctor']
  },
  permissions: {
    index: ['administrator'],
    show: ['administrator']
  },
  profile_data: {
    index: ['administrator', 'doctor', 'patient'],
    show: ['administrator', 'doctor', 'patient'],
    store: ['administrator', 'doctor', 'patient'],
    update: ['administrator', 'doctor', 'patient'],
    destroy: ['administrator', 'doctor', 'patient']
  },
  profile_fields: {
    index: ['administrator', 'doctor', 'patient'],
    show: ['administrator', 'doctor', 'patient'],
    store: ['administrator'],
    update: ['administrator']
  },
  roles: {
    index: ['administrator'],
    show: ['administrator'],
    update: ['administrator']
  },
  users: {
    index: ['administrator', 'doctor', 'patient'],
    store: ['administrator'],
    show: ['administrator', 'doctor', 'patient'],
    update: ['administrator', 'doctor', 'patient'],
    destroy: ['administrator']
  },

  /**
   * Shop
   */
  orders: {
    index: ['administrator', 'doctor', 'patient'],
    store: ['administrator', 'doctor', 'patient'],
    show: ['administrator', 'doctor', 'patient']
  }
}

export default permissionsConfig
