import Banner from '@leafygreen-ui/banner';
import Card from '@leafygreen-ui/card';
import { H3 } from '@leafygreen-ui/typography';
import { useEffect } from 'react';
import { RealmAppServiceApi } from '../../services';
import { Loader, Spacer } from '../../typography';
import { useAsync } from '../../utils';

export interface RealmEndpointsOverviewProps {
  serviceApi: RealmAppServiceApi;
}

export const RealmEndpointsOverview: React.FC<RealmEndpointsOverviewProps> = ({
  serviceApi
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
    } else if (!getEndpoints.value.length) {
      return (
        <Banner
          variant="info"
        >
          You do not have endpoints.<br />
          Start by creating a new endpoint.
        </Banner>
      );
    }
  };

  return (
    <>
      <H3>Endpoints</H3>
      <Spacer />
      <Card className="padding--md">
        {renderContent()}
      </Card>
    </>
  );
};