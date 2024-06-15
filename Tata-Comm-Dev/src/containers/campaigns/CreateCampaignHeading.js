import React, { useCallback } from 'react';
import { Button, Row } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import Breadcrumb from 'containers/navs/Breadcrumb';
import { getConvertedStringWithHyphen } from 'helpers/campaignHelper';

const CreateCampaignHeading = ({
  match,
  heading,
  addLabel,
  campaignName,
  handleBtnClick,
  channelType,
  campaignType,
  enableSaveAsDraftButton,
}) => {
  const getCampaignName = (name) => {
    return name.includes('_')
      ? getConvertedStringWithHyphen(campaignType)
      : name[0].toUpperCase() + name.slice(1);
  };

  const getCampaignHeader = useCallback(() => {
    let campaignHeader = '';
    if (channelType && !campaignType) {
      campaignHeader = `${
        campaignName ? `${campaignName} >` : ''
      }  ${channelType.toUpperCase()}`;
    } else if (channelType && campaignType) {
      campaignHeader = `${
        campaignName ? `${campaignName} >` : ''
      }  ${channelType.toUpperCase()} (${getCampaignName(campaignType)})`;
    } else {
      campaignHeader = campaignName ?? '';
    }
    return campaignHeader;
  }, [channelType, campaignType, campaignName]);

  const index = getCampaignHeader().indexOf('>');
  let campType = getCampaignHeader().substring(index - 1);
  let campName = '';
  if (index > 0) {
    campName = getCampaignHeader().slice(0, index);
  }

  return (
    <Row>
      <Colxx xxs="12">
        <div>
          <h1>
            <IntlMessages id={heading} />
          </h1>
          <div className="text-zero top-right-button-container">
            <Button
              color="primary"
              size="lg"
              className={`top-right-button ${enableSaveAsDraftButton() && ''}`}
              disabled={enableSaveAsDraftButton()}
              onClick={() => handleBtnClick()}
            >
              <IntlMessages id={addLabel} />
            </Button>
          </div>
          <Breadcrumb match={match} />
        </div>
      </Colxx>
      <Colxx xxs="12">
        <h2>
          {campName.length > 20 ? (
            <div title={campName}>
              {campName.substring(0, 20).concat('...').concat(campType)}
            </div>
          ) : (
            getCampaignHeader()
          )}
        </h2>
        <Separator className="mb-5" />
      </Colxx>
    </Row>
  );
};

export default CreateCampaignHeading;
