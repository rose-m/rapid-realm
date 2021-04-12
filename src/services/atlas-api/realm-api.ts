import { RealmLoginResponse } from './realm-api.types';
import { RealmAppApi } from './realm-app-api';
import { RealmAppDetails } from './realm-app-api.types';
import { assertResponseOk } from './utils';

const PUBLIC_REALM_API_BASE_URL = 'https://realm.mongodb.com/api/admin/v3.0' as const;

export class RealmApi {
  public static readonly API_BASE_URL = process.env.NODE_ENV === 'development'
    ? `http://localhost:8080/${PUBLIC_REALM_API_BASE_URL}`
    : PUBLIC_REALM_API_BASE_URL;

  constructor(
    private readonly accessToken: string
  ) {}

  public static async login(publicKey: string, privateKey: string): Promise<RealmApi> {
    const response = await fetch(
      `${RealmApi.API_BASE_URL}/auth/providers/mongodb-cloud/login`,
      {
        method: 'post',
        body: JSON.stringify({
          username: publicKey,
          apiKey: privateKey
        }),

      }
    );
    await assertResponseOk(response);

    const data: RealmLoginResponse = await response.json();
    if (!data.access_token) {
      throw new Error('Request succeeded but did not contain access_token');
    }

    return new RealmApi(data.access_token);
  }

  public async getApps(groupId: string): Promise<RealmAppDetails[]> {
    const response = await fetch(
      `${RealmApi.API_BASE_URL}/groups/${groupId}/apps`,
      {
        headers: this.getAuthHeaders()
      }
    );
    await assertResponseOk(response);

    const data: RealmAppDetails[] = await response.json();
    return data;
  }

  public getAppApi(appDetails: RealmAppDetails): RealmAppApi {
    return new RealmAppApi(this, appDetails);
  }

  public getAuthHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.accessToken}`
    };
  }
}