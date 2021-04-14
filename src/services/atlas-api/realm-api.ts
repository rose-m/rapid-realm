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
    private accessToken: string,
    private refreshToken: string,
    private tokenExpirationTimestamp: number
  ) {}

  public static async login(publicKey: string, privateKey: string): Promise<RealmApi> {
    const response = await fetch(
      `${RealmApi.API_BASE_URL}/auth/providers/mongodb-cloud/login`,
      {
        method: 'POST',
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
    const expirationTimestamp = RealmApi.getExpirationTimestampFromJwt(data.access_token);

    return new RealmApi(data.access_token, data.refresh_token, expirationTimestamp);
  }

  public startTokenRefresh(): number {
    return setInterval(() => {
      if (this.tokenExpirationTimestamp - new Date().getTime() < 5 * 60_000) {
        this.tryRefreshToken();
      }
    }, 60_000) as any;
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

  public async getApp(groupId: string, appId: string): Promise<RealmAppDetails> {
    const response = await fetch(
      `${RealmApi.API_BASE_URL}/groups/${groupId}/apps/${appId}`,
      {
        headers: this.getAuthHeaders()
      }
    );
    await assertResponseOk(response);

    const data: RealmAppDetails = await response.json();
    return data;
  }

  public getAppApi(appDetails: RealmAppDetails): RealmAppApi {
    return new RealmAppApi(this, appDetails);
  }

  public getAuthHeaders(token: string = this.accessToken): Record<string, string> {
    return {
      Authorization: `Bearer ${token}`
    };
  }

  private static getExpirationTimestampFromJwt(token: string): number {
    const encodedJwtPayload = token.split('.')[1];
    const jwtPayload = JSON.parse(atob(decodeURIComponent(encodedJwtPayload)));
    return jwtPayload.exp * 1000;
  }

  private async tryRefreshToken(): Promise<void> {
    const response = await fetch(
      `${RealmApi.API_BASE_URL}/auth/session`,
      {
        method: 'POST',
        headers: this.getAuthHeaders(this.refreshToken)
      }
    );
    await assertResponseOk(response);

    const data: { access_token: string } = await response.json();
    if (!data.access_token) {
      throw new Error('Request succeeded but did not contain access_token');
    }

    this.accessToken = data.access_token;
    this.tokenExpirationTimestamp = RealmApi.getExpirationTimestampFromJwt(data.access_token);
  }

}