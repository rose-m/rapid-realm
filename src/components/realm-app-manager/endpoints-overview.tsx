import Banner from '@leafygreen-ui/banner';
import Button from '@leafygreen-ui/button';
import Card from '@leafygreen-ui/card';
import ConfirmationModal from '@leafygreen-ui/confirmation-modal';
import Icon from '@leafygreen-ui/icon';
import { Cell, Row, Table, TableHeader } from '@leafygreen-ui/table';
import TextInput from '@leafygreen-ui/text-input';
import { H3 } from '@leafygreen-ui/typography';
import { useEffect, useState } from 'react';
import { RealmAppServiceApi, RealmAppServiceWebhookBasics, RealmLambda } from '../../services';
import { ButtonBar, Loader, Spacer } from '../../typography';
import { useAsync } from '../../utils';

export interface RealmEndpointsOverviewProps {
  serviceApi: RealmAppServiceApi;

  onAddedEndpoint?: (webhookId: string) => void;
  onEditEndpoint?: (webhookId: string) => void;
}

export const RealmEndpointsOverview: React.FC<RealmEndpointsOverviewProps> = ({
  serviceApi, onAddedEndpoint, onEditEndpoint
}) => {
  const [showAddEndpointModal, setShowAddEndpointModal] = useState(false);
  const [newEndpointName, setNewEndpointName] = useState('');

  const getEndpoints = useAsync(async () => {
    return await serviceApi.getWebhooks();
  });
  const addEndpoint = useAsync(async (endpointName: string) => {
    const emptySource = RealmLambda.generateFunctionSource({
      type: 'query',
      database: 'databaseName',
      collection: 'collectionName',
      queryOrAggregation: '{}',
      variables: []
    });
    return await serviceApi.createWebhook({
      name: endpointName,
      function_source: emptySource,
      respond_result: true,
      options: {
        httpMethod: 'ANY',
        validationMethod: 'NO_VALIDATION'
      }
    });
  });

  useEffect(() => {
    if (getEndpoints.status === 'idle') {
      getEndpoints.execute();
    }
  }, [getEndpoints]);

  useEffect(() => {
    if (addEndpoint.value) {
      onAddedEndpoint?.(addEndpoint.value);
      addEndpoint.reset();
    }
  }, [addEndpoint, onAddedEndpoint]);

  useEffect(() => {
    if (!showAddEndpointModal) {
      setNewEndpointName('');
    }
  }, [showAddEndpointModal]);

  const isNewEndpointNameValid = () => {
    return /^[a-zA-Z0-9_-]+$/.test(newEndpointName) && !endpointAlreadyExists(newEndpointName);
  };
  const endpointAlreadyExists = (name: string) => {
    return !!getEndpoints.value?.find(e => e.name === name);
  };

  const onConfirmAddEndpoint = () => {
    if (!isNewEndpointNameValid()) {
      return;
    }
    setShowAddEndpointModal(false);
    addEndpoint.execute(newEndpointName);
  };

  const renderContent = () => {
    if (getEndpoints.error) {
      return (
        <Banner
          variant="danger"
        >
          Failed to load the service's endpoints. Please try again.
        </Banner>
      );
    } else if (!getEndpoints.value) {
      return (
        <Loader loading={true} />
      );
    } else {
      return renderEndpointContent();
    }
  };

  const renderEndpointContent = () => {
    const endpoints = !getEndpoints.value?.length ? (
      <Banner
        variant="info"
      >
        You do not have endpoints yet.<br />
        Start by creating a new endpoint.
      </Banner>
    ) : renderEndpointsTable();
    return (
      <>
        <ButtonBar>
          <Button
            variant="primary"
            size="small"
            leftGlyph={addEndpoint.status !== 'pending' ? <Icon glyph="Plus" /> : null}
            onClick={() => setShowAddEndpointModal(true)}
            disabled={addEndpoint.status === 'pending'}
          >
            {addEndpoint.status === 'pending' ? (
              <Loader
                loading={true}
                variant="inline"
                label="Adding Endpoint..."
              />
            ) : (
              <>Add Endpoint</>
            )}
          </Button>
        </ButtonBar>
        <Spacer size="l" />
        {addEndpoint.error && (<>
          <Banner
            variant="danger"
          >
            Failed to add the new endpoint. Please try again.
          </Banner>
          <Spacer size="l" />
        </>)}
        {endpoints}
      </>
    );
  };

  const renderEndpointsTable = () => {
    return (
      <Table
        data={getEndpoints.value ?? []}
        columns={[
          <TableHeader label="Name" />,
          <TableHeader label="Last Modified" />,
          <TableHeader label="Actions" />
        ]}
      >
        {(row: { datum: RealmAppServiceWebhookBasics }) => (
          <Row key={row.datum.name}>
            <Cell>{row.datum.name}</Cell>
            <Cell>
              {new Date(row.datum.last_modified * 1000).toISOString()}
            </Cell>
            <Cell>
              <Button
                size="xsmall"
                leftGlyph={<Icon glyph="Edit" />}
                onClick={() => onEditEndpoint?.(row.datum._id)}
              >
                Edit
              </Button>
            </Cell>
          </Row>
        )}
      </Table>

    );
  };
  const renderAddEndpointModal = () => {
    return (
      <ConfirmationModal
        title="Add a new Endpoint"
        buttonText="Add Endpoint"
        open={showAddEndpointModal}
        onConfirm={onConfirmAddEndpoint}
        onCancel={() => setShowAddEndpointModal(false)}
        submitDisabled={!isNewEndpointNameValid()}
      >
        <TextInput
          label="Name"
          description="The name must only contain ASCII letters, numbers, underscores, and hyphens."
          value={newEndpointName}
          state={newEndpointName ? (isNewEndpointNameValid() ? 'valid' : 'error') : 'none'}
          onChange={e => setNewEndpointName(e.target.value.trim())}
        />
        {endpointAlreadyExists(newEndpointName) ? (
          <>
            <Spacer />
            <Banner
              variant="danger"
            >
              An endpoint with the same name already exists.
            </Banner>
          </>
        ) : null}
      </ConfirmationModal>
    );
  }

  return (
    <Card className="padding--md">
      <H3>
        <Icon glyph="Apps" size="large" /> Endpoints
      </H3>
      <Spacer />
      {renderContent()}
      {renderAddEndpointModal()}
    </Card>
  );
};