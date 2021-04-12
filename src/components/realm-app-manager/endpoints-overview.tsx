import Banner from '@leafygreen-ui/banner';
import Button from '@leafygreen-ui/button';
import Card from '@leafygreen-ui/card';
import Icon from '@leafygreen-ui/icon';
import { Cell, Row, Table, TableHeader } from '@leafygreen-ui/table';
import { H3 } from '@leafygreen-ui/typography';
import { useEffect } from 'react';
import { RealmAppServiceApi, RealmAppServiceWebhookBasics } from '../../services';
import { ButtonBar, Loader, Spacer } from '../../typography';
import { useAsync } from '../../utils';

export interface RealmEndpointsOverviewProps {
  serviceApi: RealmAppServiceApi;

  onEditEndpoint: (webhookId: string) => void;
}

export const RealmEndpointsOverview: React.FC<RealmEndpointsOverviewProps> = ({
  serviceApi, onEditEndpoint
}) => {
  const getEndpoints = useAsync(async () => {
    return await serviceApi.getWebhooks();
  });
  useEffect(() => {
    if (getEndpoints.status === 'idle') {
      getEndpoints.execute();
    }
  }, [getEndpoints]);

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
            leftGlyph={<Icon glyph="Plus" />}
          >
            Add Endpoint
          </Button>
        </ButtonBar>
        <Spacer />
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
                onClick={() => onEditEndpoint(row.datum._id)}
              >
                Edit
              </Button>
            </Cell>
          </Row>
        )}
      </Table>

    );
  };

  return (
    <Card className="padding--md">
      <H3>
        <Icon glyph="Apps" size="large" /> Endpoints
      </H3>
      <Spacer />
      {renderContent()}
    </Card>
  );
};