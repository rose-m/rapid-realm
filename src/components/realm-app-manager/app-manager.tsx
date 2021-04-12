import Button from '@leafygreen-ui/button';
import { Redirect } from 'react-router';
import { useRealm } from '../../context/realm';

export const RealmAppManager: React.FC = () => {
  const realm = useRealm();
  if (!realm.realmServiceData) {
    return <Redirect to="/configure" />;
  }

  return (
    <>
      <h1>Realm</h1>

      <Button
        onClick={() => realm.clear()}
      >
        Clear Realm Data
      </Button>
    </>
  );
}
