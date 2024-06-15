import { all } from 'redux-saga/effects';
import authSagas from './auth/saga';
import todoSagas from './todo/saga';
import chatSagas from './chat/saga';
import surveyListSagas from './surveyList/saga';
import surveyDetailSagas from './surveyDetail/saga';
import contactsSagas from './contacts/saga';
import inboxSagas from './inbox/saga';
import channelsSagas from './channels/saga';
import agentsSagas from './agents/saga';
import labelsSagas from './labels/saga';
import cannedsSagas from './canneds/saga';
import attributesSagas from './attributes/saga';
import teamsSagas from './teams/saga';
import integrationsSagas from './integrations/saga';
import applicationsSagas from './applications/saga';
import accountsSagas from './accounts/saga';
import reportsSagas from './reports/saga';
import campaignsSagas from './campaigns/saga';
import notificationsSagas from './notifications/saga';
import importUsersSagas from './import-users/saga';
import dashboardCampaignsSagas from './dashboard-campaigns/saga';
import settingChannelsSagas from './settingsChannels/saga';
import segmentationSagas from './segmentation/saga';
import s3sftpSagas from './s3-sftp/saga';
import controlGroupsSagas from './control-groups/saga';
import flowsSagas from './flows/saga';
import recentEventsSagas from './recent-events/saga';

export default function* rootSaga() {
  yield all([
    authSagas(),
    todoSagas(),
    chatSagas(),
    surveyListSagas(),
    surveyDetailSagas(),
    contactsSagas(),
    inboxSagas(),
    channelsSagas(),
    agentsSagas(),
    labelsSagas(),
    cannedsSagas(),
    attributesSagas(),
    teamsSagas(),
    integrationsSagas(),
    applicationsSagas(),
    accountsSagas(),
    reportsSagas(),
    campaignsSagas(),
    notificationsSagas(),
    importUsersSagas(),
    dashboardCampaignsSagas(),
    settingChannelsSagas(),
    segmentationSagas(),
    s3sftpSagas(),
    controlGroupsSagas(),
    flowsSagas(),
    recentEventsSagas(),
  ]);
}
