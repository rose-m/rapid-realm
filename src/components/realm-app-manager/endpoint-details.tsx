import Banner from '@leafygreen-ui/banner';
import Button from '@leafygreen-ui/button';
import Card from '@leafygreen-ui/card';
import Code from '@leafygreen-ui/code';
import Icon from '@leafygreen-ui/icon';
import { H3 } from '@leafygreen-ui/typography';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RealmAppServiceApi } from '../../services';
import { Loader, Spacer } from '../../typography';
import { useAsync } from '../../utils';

export interface RealmEndpointDetailsProps {
  serviceApi: RealmAppServiceApi;

  onBackToOverview: () => void;
}

export const RealmEndpointDetails: React.FC<RealmEndpointDetailsProps> = ({
  serviceApi, onBackToOverview
}) => {
  const { webhookId } = useParams() as { webhookId: string };
  const getWebhookDetails = useAsync(async () => {
    return await serviceApi.getWebhook(webhookId);
  });
  useEffect(() => {
    if (getWebhookDetails.status === 'idle') {
      getWebhookDetails.execute();
    }
  }, [getWebhookDetails]);

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
        <Code
          language="javascript"
        >
          {getWebhookDetails.value.function_source}
        </Code>
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
      <H3>
        <Icon glyph="CurlyBraces" size="large" /> <code>{getWebhookDetails.value?.name ?? '...'}</code>
      </H3>
      <Spacer />
      {renderContent()}
    </Card>
  );
};
