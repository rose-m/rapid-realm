import Badge from '@leafygreen-ui/badge';
import Banner from '@leafygreen-ui/banner';
import Button from '@leafygreen-ui/button';
import Card from '@leafygreen-ui/card';
import Code from '@leafygreen-ui/code';
import Icon from '@leafygreen-ui/icon';
import { Subtitle } from '@leafygreen-ui/typography';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RealmAppServiceApi, RealmLambda } from '../../../services';
import { Loader, Spacer } from '../../../typography';
import { useAsync } from '../../../utils';
import { EndpointDetailsFunctionality, EndpointDetailsFunctionalityEditingState } from './functionality';
import { EndpointDetailsHeader } from './header';
import { EndpointDetailsState } from './types';
import './endpoint-details.less';

export interface RealmEndpointDetailsProps {
  serviceApi: RealmAppServiceApi;

  onBackToOverview: () => void;
}

export const RealmEndpointDetails: React.FC<RealmEndpointDetailsProps> = ({
  serviceApi, onBackToOverview
}) => {
  const { webhookId } = useParams() as { webhookId: string };
  const [state, setState] = useState<EndpointDetailsState>('default');
  const [showPublishError, setShowPublishError] = useState(false);
  const [functionalityEditingState, setFunctionalityEditingState] = useState<EndpointDetailsFunctionalityEditingState | undefined>();

  const getWebhookDetails = useAsync(async () => {
    return await serviceApi.getWebhook(webhookId);
  });
  useEffect(() => {
    if (getWebhookDetails.status === 'idle') {
      getWebhookDetails.execute();
    }
  }, [getWebhookDetails]);

  const updateWebhook = useAsync(async (functionSource: string) => {
    setShowPublishError(false);
    return await serviceApi.updateWebhook(webhookId, {
      name: getWebhookDetails.value!.name,
      function_source: functionSource,
      respond_result: true,
      options: {
        httpMethod: getWebhookDetails.value!.options.httpMethod,
        validationMethod: 'NO_VALIDATION'
      }
    });
  });
  useEffect(() => {
    if (state !== 'publishing' || updateWebhook.status === 'idle') {
      return;
    } else if (updateWebhook.status === 'success') {
      setState('default');
      getWebhookDetails.reset();
    } else if (updateWebhook.status === 'error') {
      setState('editing');
      setShowPublishError(true);
    }
  }, [state, updateWebhook.status, getWebhookDetails]);

  useEffect(() => {
    if (state === 'default') {
      setShowPublishError(false);
    }
  }, [state]);

  const onPublishUpdates = () => {
    if (state !== 'editing' || !functionalityEditingState?.isValid || !functionalityEditingState?.descriptor) {
      return;
    }
    const functionSource = RealmLambda.generateFunctionSource(functionalityEditingState.descriptor);
    setState('publishing');
    updateWebhook.execute(functionSource);
  };

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
          state={state}
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

      <Spacer size="l" />

      <EndpointDetailsHeader
        webhookDetails={getWebhookDetails.value}
        state={state}
        mayPublish={functionalityEditingState?.isValid}
        onEditWebhook={() => setState('editing')}
        onCancelEditing={() => setState('default')}
        onPublishUpdates={onPublishUpdates}
      />

      <Spacer size="xl" />

      {renderEndpointURL()}

      <Spacer size="xl" />

      {showPublishError && (
        <>
          <Banner
            variant="danger"
          >
            Publishing your endpoint details failed. Please try again later.
          </Banner>
          <Spacer />
        </>
      )}

      {renderContent()}
    </Card>
  );
};
