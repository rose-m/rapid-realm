import { RealmApi } from './realm-api';
import { RealmAppDetails } from './realm-app-api.types';
import { RealmAppServiceApi } from './realm-app-service-api';
import { RealmAppServiceDetails } from './realm-app-service-api.types';
import { assertResponseOk } from './utils';

export class RealmAppApi {

  constructor(
    private readonly realmApi: RealmApi,
    private readonly details: RealmAppDetails
  ) {}

  public getRealm(): RealmApi {
    return this.realmApi;
  }

  public getDetails(): RealmAppDetails {
    return {
      ...this.details
    };
  }

  public async getServices(): Promise<RealmAppServiceDetails[]> {
    const response = await fetch(
      `${RealmApi.API_BASE_URL}/groups/${this.details.group_id}/apps/${this.details._id}/services`,
      {
        headers: this.realmApi.getAuthHeaders()
      }
    );
    await assertResponseOk(response);

    const data: RealmAppServiceDetails[] = await response.json();
    return data;
  }

  public async getService(serviceId: string): Promise<RealmAppServiceDetails> {
    const response = await fetch(
      `${RealmApi.API_BASE_URL}/groups/${this.details.group_id}/apps/${this.details._id}/services/${serviceId}`,
      {
        headers: this.realmApi.getAuthHeaders()
      }
    );
    await assertResponseOk(response);

    const data: RealmAppServiceDetails = await response.json();
    return data;
  }

  public async createService(serviceName: string): Promise<RealmAppServiceDetails> {
    const response = await fetch(
      `${RealmApi.API_BASE_URL}/groups/${this.details.group_id}/apps/${this.details._id}/services`,
      {
        method: 'POST',
        body: JSON.stringify({
          name: serviceName,
          type: 'http',
          config: {}
        }),
        headers: this.realmApi.getAuthHeaders()
      }
    );
    await assertResponseOk(response);

    const data: RealmAppServiceDetails = await response.json();
    return data;
  }

  public getServiceApi(serviceDetails: RealmAppServiceDetails): RealmAppServiceApi {
    return new RealmAppServiceApi(this, serviceDetails);
  }

}