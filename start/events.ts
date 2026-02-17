import Event from '@ioc:Adonis/Core/Event'

/**
 * Auth
 */
;['Auth/SendResetCode'].forEach((listener) => {
  Event.on('password/reset-code-generated', listener)
})

/**
 * Chat
 */
;['Chat/Sent/NotifyChatGroup'].forEach((listener) => {
  Event.on('chat/sent', listener)
})

/**
 * Consultations
 */
;['Consultation/Paid/SendMail', 'Consultation/Paid/SendSMS'].forEach(
  (listener) => {
    Event.on('consultation/paid', listener)
  }
)
;['Consultation/Confirmed/SendMail', 'Consultation/Confirmed/SendSMS'].forEach(
  (listener) => {
    Event.on('consultation/confirmed', listener)
  }
)

;['Consultation/CallOthers'].forEach((listener) => {
  Event.on('consultation/started', listener)
})

;['Consultation/JoinOthers'].forEach((listener) => {
  Event.on('consultation/joined', listener)
})

;[
  'Consultation/Ended/CompleteTwilioRoom',
  'Consultation/Ended/SendMail',
  'Consultation/Ended/SendSMS'
].forEach((listener) => {
  Event.on('consultation/ended', listener)
})

/**
 * Community
 */
;['Community/ForumMessage/NotifyForum'].forEach((listener) => {
  Event.on('forum-message/created', listener)
})

/**
 * Finance
 */
;['Finance/Coupons/Generated/SendByMail'].forEach((listener) => {
  Event.on('coupons/genrated', listener)
})

/**
 * Misc
 */
;['Misc/Notifications/Created/SendInApp'].forEach((listener) => {
  Event.on('notifications/created', listener)
})

/**
 * People
 */
;['People/User/SendWelcomeMail'].forEach((listener) => {
  Event.on('user/created', listener)
})
;['People/User/LastSeenSet/NotifyConsultationRoom'].forEach((listener) => {
  Event.on('user/last-seen-set', listener)
})
