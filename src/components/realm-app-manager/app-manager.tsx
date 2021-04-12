import { Redirect } from 'react-router';
import { useRealm } from '../../context/realm'

export const RealmAppManager: React.FC = () => {
    const realmData = useRealm();

    return realmData.realm ? (
        <h1>Realm</h1>
    ) : (
        <Redirect to="/" />
    );
}
