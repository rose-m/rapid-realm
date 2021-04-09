
export interface RealmAuthData {
    accessToken: string;
    groupId: string;
    appId: string;
    serviceId: string;
}

export interface RealmContext {
    realm?: RealmAuthData | undefined;
    configureRealm: (data: RealmAuthData) => void;
}