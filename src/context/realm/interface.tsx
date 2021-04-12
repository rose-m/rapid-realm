import { RealmAppServiceApi } from '../../services';

export interface RealmServiceData {
    publicKey: string;
    privateKey: string;
    groupId: string;
    appId: string;
    serviceId: string;
}

export interface RealmContext {
    realmServiceData?: RealmServiceData | undefined;
    serviceApi?: RealmAppServiceApi | undefined;
    configureRealm: (data: RealmServiceData, service: RealmAppServiceApi) => void;
    clear: () => void;
}
