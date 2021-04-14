import Badge from '@leafygreen-ui/badge';
import Button from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import { RealmLogoMark } from '@leafygreen-ui/logo';
import { Body, H2 } from '@leafygreen-ui/typography';
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router';
import { useRealm } from '../../context/realm';
import { Loader, Spacer } from '../../typography';
import './app-manager.less';
import { RealmEndpointDetails } from './endpoint-details/endpoint-details';
import { RealmEndpointsOverview } from './endpoints-overview';

export const RealmAppManager: React.FC = () => {
  const { path } = useRouteMatch();
  const history = useHistory();
  const realm = useRealm();

  if (!realm.realmServiceData) {
    return <Redirect to="/configure" />;
  }

  if (!realm.serviceApi) {
    return (
      <div className="realm-app-manager">
        <Loader loading={true} label="Initializing..." />
      </div>
    );
  }

  const onAddedEndpoint = (webhookId: string) => {
    history.push(`${path}/endpoints/${webhookId}`);
  };
  const onEditEndpoint = (webhookId: string) => {
    history.push(`${path}/endpoints/${webhookId}`);
  };
  const onBackToOverview = () => {
    history.push(`${path}/endpoints`);
  };

  return (
    <div className="realm-app-manager">
      <header className="realm-app-manager__header">
        <RealmLogoMark size={64} />
        <Spacer direction="horizontal" />

        <div className="realm-app-manager__title">
          <H2>Rapid Realm</H2>
          <Body>
            Managing App <Badge>{realm.serviceApi.getApp().getDetails().name}</Badge> &mdash; Service <Badge>{realm.serviceApi.getDetails().name}</Badge>
          </Body>
        </div>

        <Spacer direction="flex" />

        <Button
          leftGlyph={<Icon glyph="Unlock" />}
          onClick={() => realm.clear()}
        >
          Logout
        </Button>
      </header>

      <Spacer size="xl" />

      <Switch>
        <Route path={`${path}/endpoints/:webhookId`}>
          <RealmEndpointDetails
            serviceApi={realm.serviceApi}
            onBackToOverview={onBackToOverview}
          />
        </Route>
        <Route path={`${path}/endpoints`}>
          <RealmEndpointsOverview
            serviceApi={realm.serviceApi}
            onAddedEndpoint={onAddedEndpoint}
            onEditEndpoint={onEditEndpoint}
          />
        </Route>
        <Route path="*">
          <Redirect to={`${path}/endpoints`} />
        </Route>
      </Switch>
    </div>
  );
}
