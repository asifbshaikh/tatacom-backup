import { combineReducers } from 'redux';
import settings from './settings/reducer';
import menu from './menu/reducer';
import authUser from './auth/reducer';
import todoApp from './todo/reducer';
import chatApp from './chat/reducer';
import surveyListApp from './surveyList/reducer';
import surveyDetailApp from './surveyDetail/reducer';
import contactsApp from './contacts/reducer';
import inboxApp from './inbox/reducer';
import channelsApp from './channels/reducer';
import agentsApp from './agents/reducer';
import labelsApp from './labels/reducer';
import cannedsApp from './canneds/reducer';
import attributesApp from './attributes/reducer';
import teamsApp from './teams/reducer';
import integrationsApp from './integrations/reducer';
import applicationsApp from './applications/reducer';
import accountsApp from './accounts/reducer';
import reportsApp from './reports/reducer';
import campaignsApp from './campaigns/reducer';
import notificationsApp from './notifications/reducer';
import settingsChannels from './settingsChannels/reducer';
import importusersApp from './import-users/reducer';
import dashboardCampaignsApp from './dashboard-campaigns/reducers';
import segmentationApp from './segmentation/reducer';
import s3sftpApp from './s3-sftp/reducer';
import controlGroupsApp from './control-groups/reducer';
import flowsApp from './flows/reducer';
import recentEventApp from './recent-events/reducer';

const reducers = combineReducers({
  menu,
  settings,
  authUser,
  todoApp,
  chatApp,
  surveyListApp,
  surveyDetailApp,
  contactsApp,
  inboxApp,
  channelsApp,
  agentsApp,
  labelsApp,
  cannedsApp,
  attributesApp,
  teamsApp,
  integrationsApp,
  applicationsApp,
  accountsApp,
  reportsApp,
  campaignsApp,
  notificationsApp,
  settingsChannels,
  importusersApp,
  dashboardCampaignsApp,
  segmentationApp,
  s3sftpApp,
  controlGroupsApp,
  flowsApp,
  recentEventApp,
});

export default reducers;
