import { createContext, useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { RealmApi, RealmAppServiceApi } from '../../services/atlas-api';
import { RealmContext, RealmServiceData } from './interface';
import { RealmDataStorage } from './storage';

const realmContext = createContext<RealmContext | undefined>(undefined);
const storage = new RealmDataStorage();

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

  useEffect(() => {
    const loginAndGetServiceApi = async (serviceData: RealmServiceData) => {
      try {
        const realmApi = await RealmApi.login(serviceData.publicKey, serviceData.privateKey);
        const realmApp = realmApi.getAppApi(await realmApi.getApp(serviceData.groupId, serviceData.appId));
        const realmService = realmApp.getServiceApi(await realmApp.getService(serviceData.serviceId));
        realm.configureRealm(serviceData, realmService);
      } catch (e) {
        console.error('Failed to login and get service API', e);
        realm.clear();
      }
    };

    if (realm.realmServiceData && !realm.serviceApi) {
      loginAndGetServiceApi(realm.realmServiceData);
    }
  }, [realm, realm.realmServiceData, realm.serviceApi]);

  return (
    <realmContext.Provider value={realm}>
      {children}
    </realmContext.Provider>
  )
});

function useProvideRealm(): RealmContext {
  const [realmServiceData, setRealmData] = useState<RealmServiceData | undefined>(storage.loadData());
  const [serviceApi, setServiceApi] = useState<RealmAppServiceApi | undefined>(undefined);

  const configureRealm = (data: RealmServiceData, serviceApi: RealmAppServiceApi) => {
    storage.saveData(data);
    setRealmData({ ...data });
    setServiceApi(serviceApi);
  };

  const clear = () => {
    storage.saveData(undefined);
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