import Button from '@leafygreen-ui/button';
import Badge from '@leafygreen-ui/badge';
import { RealmLogoMark } from '@leafygreen-ui/logo';
import { Body, H2 } from '@leafygreen-ui/typography';
import { Redirect } from 'react-router';
import { useRealm } from '../../context/realm';
import { Spacer } from '../../typography';
import './app-manager.less';

export const RealmAppManager: React.FC = () => {
  const realm = useRealm();
  if (!realm.realmServiceData) {
    return <Redirect to="/configure" />;
  }
  if (!realm.serviceApi) {
    realm.clear();
    return <Redirect to="/configure" />;
  }

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
          onClick={() => realm.clear()}
        >
          Logout
        </Button>
      </header>

    </div>
  );
}
