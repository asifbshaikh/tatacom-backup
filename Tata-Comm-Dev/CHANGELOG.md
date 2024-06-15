# CHANGELOG ENGAGE (10-10-10)

## 1.0.0 (10-10-10)

Features:
- DE03-860 Back to Imports message pop up not getting thrown for top navigation and other available sections click outside of Import Users page	
- Implemented Search, channel type, delivery type filters on dashboard	
- Resolved merge issues	
- Test cases are added and API integrated for from Email Address	
- DE03-993 - FE- Filter Segment -User bheviour Filter and user Affinity advanced filter according to dataTypes	
- Export User from Segment Filter (Ticket no: DE03-779)

Bug-Fixes:
- Bug * and % should not be allowed in Campaign name	
- DE03-1010 Personalize message should shown in front of personilse Checkbox and DE03-996	
- Fixed issue DE03-1016 first-last-seen-date-issue.	

## 1.0.1 (11-10-23)
Features:
- DE03-801 | API integration for whatsapp template	
- Added .env in .gitignore under husky - DE03-1043	
- DE03-882 | Timeozne issue and segment id issue	
- Changes for email-connector -changes-DE03-1059	
- DE03-995 : Filter By Users - User Affinity Period Filter Row Implementation.	
- DE03-1012 | SMS campaign scheduling at specific time	
- custom attributes mapping fixes- DE03-967	
- Added .env and moved base url from defaultValues file to .env DE03-1043

## 1.0.2 (12-10-23)

- DE03-801 | DE03-1071 | Issue on Email campaign	
- Implement refresh and reset button changes on dashboard (Ticket no: DE03: 137 , DE03- 140)	
- DE03-1044 : Remove Filter Section and Nested Filter Section on Close button.	
- DE03-1024 - FE- Filter Segment -Clean up values on action	
- Implemented Edit Filter Segment (DE03-694)	
- updated Segmantation and code refactoring for schedule email campaign - DE03-1063	
- DE03-1061-SMS Campaign : when user personlise message in {{name}}. it show one { in personlise section	
- Implemented refresh and reset functionality on dashboard (Ticket No: DE03-137, DE03-140)	
- DE03-1050- Exclude User Filter Segment

## 1.0.2 (13-10-23)

- Hot Fix for WhatsApp Camp Periodic scheduling	
- User Reports Download API Integration (Ticket no: DE03-1076)	
- UI UX modification for Segmentation Filters.	
- Dev-dependency removed	
- DE03-978-lastrun	
- QA bugfix	

## 1.0.3 (14-10-23)

- DE03-1131-Email Channel Configuration - Email Connector is shown even after deleting	
- DE03-1099-Fixes comments on ticket	
- Email campaign schedule fixes- DE03-1105	
- DE03-698 | Duplicate Filter Segment

## 1.0.4 (14-10-23)
- FC and DND modifications.	
- DE03-1140 | What's App Campaign- Data reset for some pages, When user go on Campaign type/ channel.	
- DE03-1132-"Create-Campaign"	
- DE02-1178-Import Users- Database Column and CSV column alignment	
- Added Reset Button fix	
- Access campaign dashboard info page creation : DE03-561
- fc dnd send date to start date and validation on end date greater than start date	
- Change Template functionality implemented - DE03-1143	
- DE03-1174 | Made Inbox id blank on change of channel	
- Added Selected User Attribute to test email campaign	
- DE03-1211 | For email campaign "Save as draft" showing successful but on dashboard its not going in draft column and showing Failed status	
- DE03-1126, 1165	
- Fixed bug DE03-1207-User need to refresh the page everytime when user done the changes it is not reflected automatically	
- fixed DE03-1196-SMS / WhatsApp Campaign- Sender name displayed along with sender id in content Configuration page for Sender dropdown	
- QA Hot fix	
- Hot fix tinyurl and delivery control

## 1.0.5 (23-10-23)
- Hide Campaign Timezone Bug(Ticket no: DE03-1194) and Change Email icon Position (Ticket no: DE03-1224)
- EDIT Filter
- DE03-694 Edit Filter
- Segment Info Page data is getting captured incorrectly Bug - DE03 - 1116
- removed preview text from email campaign content - DE03-1210
- Login Dashboard- if campaigns sms failed due to some reason, we have to displayed the errors - DE03-1145

## 1.0.5 (01-11-23)
Custom attribute label fix-DE03-1323
DE03-1320 | WhatsApp Campaign: Publish button show disabled when user select time correctly
DE03-1329 | As a user, I want to compare two campaigns for analysis.