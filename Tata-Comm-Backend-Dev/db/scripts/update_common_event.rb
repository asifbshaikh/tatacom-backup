ec = CommonEvent.find_by(displayed_name: 'User Logout')
ec&.update(name: 'USER_LOGOUT')

ec = CommonEvent.find_by(displayed_name: 'On-site Message Clicked')
ec&.update(name: 'ONSITE_MESSAGE_TEMPLATE_CLICKED', displayed_name: 'Onsite Message Template Clicked')
puts ec&.displayed_name

ec = CommonEvent.find_by(displayed_name: 'On-site Message Shown')
ec&.update(name: 'ONSITE_MESSAGE_TEMPLATE_SHOWN', displayed_name: 'Onsite Message Template Shown')
puts ec&.displayed_name

ec = CommonEvent.find_by(displayed_name: 'On-site Message Closed')
ec&.update(name: 'ONSITE_MESSAGE_TEMPLATE_CLOSED', displayed_name: 'Onsite Message Template Closed')
puts ec&.displayed_name

ec = CommonEvent.find_by(displayed_name: 'On-site Message Auto Dismissed')
ec&.update(name: 'ONSITE_MESSAGE_TEMPLATE_AUTO_DISMISS', displayed_name: 'Onsite Message Template Auto Dismiss')
puts ec&.displayed_name

ec = CommonEvent.find_by(displayed_name: 'Card Campaign Delivered')
ec&.update(name: 'CARD_DELIVERED', displayed_name: 'Card Delivered')
puts ec&.displayed_name

ec = CommonEvent.find_by(displayed_name: 'Card Campaign Sent')
ec&.update(name: 'CARD_SENT', displayed_name: 'Card Sent')
puts ec&.displayed_name

ec = CommonEvent.find_by(displayed_name: 'Card Campaign Viewed')
ec&.update(name: 'CARD_VIEWED', displayed_name: 'Card Viewed')
puts ec&.displayed_name

ec = CommonEvent.find_by(displayed_name: 'Email Clicked')
ec&.update(name: 'EMAIL_CLICKED', displayed_name: 'Email Clicked')
puts ec&.displayed_name

ec = CommonEvent.find_by(displayed_name: 'Email Bounced')
ec&.update(name: 'EMAIL_BOUNCED', displayed_name: 'Email Bounced')
puts ec&.displayed_name

ec = CommonEvent.find_by(displayed_name: 'Email Spam Complained')
ec&.update(name: 'EMAIL_COMPLAINED', displayed_name: 'Email Complained')
puts ec&.displayed_name

ec = CommonEvent.find_by(displayed_name: 'User removed from the campaign due to Control Group')
ec&.update(name: 'USER_REMOVED_FROM_CONTROL_GROUP', displayed_name: 'User removed from control group')
puts ec&.displayed_name

ec = CommonEvent.find_by(displayed_name: 'Facebook Audience Synced')
ec&.update(name: 'FACEBOOK_AUDIENCE_SYNCED', displayed_name: 'Facebook Audience Synced')
puts ec&.displayed_name

ec = CommonEvent.find_by(displayed_name: 'LoggedIn')
ec&.update(name: 'LOGGED_IN_STATUS', displayed_name: 'Logged In Status')
puts ec&.displayed_name

ec = CommonEvent.find_by(displayed_name: 'Email Unsubscribe Drop')
ec&.update(name: 'EMAIL_DROPPED', displayed_name: 'Email Dropped')
puts ec&.displayed_name
