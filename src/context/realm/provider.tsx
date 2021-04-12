import { createContext, useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { RealmAppServiceApi } from '../../services/atlas-api';
import { RealmContext, RealmServiceData } from './interface';

const realmContext = createContext<RealmContext | undefined>(undefined);

export function useRealm() {
  return useContext(realmContext) as RealmContext;
}

export const ProvideRealm = withRouter(({ children, history, location }) => {
  const realm = useProvideRealm();
  useEffect(() => {
    if (!realm.realmServiceData && location.pathname !== '/configure') {
      history.push('/configure');
    } else if (realm.realmServiceData && location.pathname === '/configure') {
      history.push('/');
    }
  }, [realm.realmServiceData, history, location.pathname]);

  return (
    <realmContext.Provider value={realm}>
      {children}
    </realmContext.Provider>
  )
});

function useProvideRealm(): RealmContext {
  const [realmServiceData, setRealmData] = useState<RealmServiceData | undefined>(undefined);
  const [serviceApi, setServiceApi] = useState<RealmAppServiceApi | undefined>(undefined);

  const configureRealm = (data: RealmServiceData, serviceApi: RealmAppServiceApi) => {
    setRealmData({ ...data });
    setServiceApi(serviceApi);
  };

  const clear = () => {
    setRealmData(undefined);
    setServiceApi(undefined);
  };

  return {
    realmServiceData,
    serviceApi,
    configureRealm,
    clear
  };
}