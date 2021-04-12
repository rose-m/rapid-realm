import { RealmServiceData } from './interface';

export class RealmDataStorage {
    private static readonly REALM_DATA_STORAGE_KEY = 'rapidrealm_realm_data_storage_v1';

    public saveData(data?: RealmServiceData | undefined): void {
        if (!data) {
            localStorage.removeItem(RealmDataStorage.REALM_DATA_STORAGE_KEY);
        } else {
            localStorage.setItem(RealmDataStorage.REALM_DATA_STORAGE_KEY, JSON.stringify(data));
        }
    }

    public loadData(): RealmServiceData | undefined {
        const data = localStorage.getItem(RealmDataStorage.REALM_DATA_STORAGE_KEY);
        if (!!data) {
            try {
                return JSON.parse(data);
            } catch (e) {
                console.error('Failed to deserialize stored data', e);
            }
        }
        return undefined;
    }
}