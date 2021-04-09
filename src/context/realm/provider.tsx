import { createContext, useContext, useState } from 'react';
import { RealmContext, RealmAuthData } from './interface';

const realmContext = createContext<RealmContext | undefined>(undefined);

export function useRealm() {
    return useContext(realmContext) as RealmContext;
}

export const ProvideRealm: React.FC = ({ children }) => {
    const realm = useProvideRealm();
    return (
        <realmContext.Provider value={realm}>
            {children}
        </realmContext.Provider>
    )
}

function useProvideRealm(): RealmContext {
    const [realmData, setRealmData] = useState<RealmAuthData | undefined>(undefined);

    const configureRealm = (data: RealmAuthData) => {
        setRealmData({ ...data });
    };

    return {
        realm: realmData,
        configureRealm
    };
}