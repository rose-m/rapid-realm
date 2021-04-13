import Badge from '@leafygreen-ui/badge';
import Banner from '@leafygreen-ui/banner';
import Button from '@leafygreen-ui/button';
import Card from '@leafygreen-ui/card';
import Code from '@leafygreen-ui/code';
import Icon from '@leafygreen-ui/icon';
import { Subtitle } from '@leafygreen-ui/typography';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RealmAppServiceApi } from '../../../services';
import { Loader, Spacer } from '../../../typography';
import { useAsync } from '../../../utils';
import { EndpointDetailsFunctionality, EndpointDetailsFunctionalityEditingState } from './functionality';
import { EndpointDetailsHeader } from './header';
import './endpoint-details.less';

export interface RealmEndpointDetailsProps {
  serviceApi: RealmAppServiceApi;

  onBackToOverview: () => void;
}

export const RealmEndpointDetails: React.FC<RealmEndpointDetailsProps> = ({
  serviceApi, onBackToOverview
}) => {
  const { webhookId } = useParams() as { webhookId: string };
  const [editing, setEditing] = useState(false);
  const [functionalityEditingState, setFunctionalityEditingState] = useState<EndpointDetailsFunctionalityEditingState | undefined>();

  const getWebhookDetails = useAsync(async () => {
    return await serviceApi.getWebhook(webhookId);
  });
  useEffect(() => {
    if (getWebhookDetails.status === 'idle') {
      getWebhookDetails.execute();
    }
  }, [getWebhookDetails]);

  const renderEndpointURL = () => {
    if (!getWebhookDetails.value) {
      return null;
    }

    return (
      <>
        <Subtitle>Endpoint</Subtitle>
        <Spacer />
        <div className="endpoint-details__url">
          <Badge
            className="endpoint-details__url__method"
          >
            {getWebhookDetails.value.options.httpMethod}
          </Badge>
          <Spacer direction="horizontal" size="s" />
          <Code
            language="http"
          >
            {getWebhookDetails.value.$url ?? ''}
          </Code>
        </div>
      </>
    );
  };

  const renderContent = () => {
    if (getWebhookDetails.error) {
      return (
        <Banner
          variant="danger"
        >
          Could not load webhook details. Please try again later.
        </Banner>
      );
    } else if (!getWebhookDetails.value) {
      return (
        <Loader loading={true} />
      );
    } else {
      return (
        <EndpointDetailsFunctionality
          webhookDetails={getWebhookDetails.value}
          editing={editing}
          onEditChange={setFunctionalityEditingState}
        />
      )
    }
  };

  return (
    <Card className="padding--md">
      <Button
        size="xsmall"
        leftGlyph={<Icon glyph="ChevronLeft" />}
        onClick={() => onBackToOverview()}
      >
        Back to Overview
      </Button>

      <Spacer />

      <EndpointDetailsHeader
        webhookDetails={getWebhookDetails.value}
        editing={editing}
        mayPublish={functionalityEditingState?.isValid}
        onEditWebhook={() => setEditing(true)}
        onCancelEditing={() => setEditing(false)}
        onPublishUpdates={() => setEditing(false)}
      />

      <Spacer size="l" />

      {renderEndpointURL()}
      <Spacer />
      {renderContent()}
    </Card>
  );
};
