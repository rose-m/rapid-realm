import { RealmApi } from './realm-api';
import { RealmAppApi } from './realm-app-api';
import { RealmAppServiceDetails, RealmAppServiceWebhookBasics, RealmAppServiceWebhookDetails } from './realm-app-service-api.types';
import { assertResponseOk } from './utils';

export class RealmAppServiceApi {

  constructor(
    private readonly realmApp: RealmAppApi,
    private readonly details: RealmAppServiceDetails
  ) {}

  public getApp(): RealmAppApi {
    return this.realmApp;
  }

  public getDetails(): RealmAppServiceDetails {
    return {
      ...this.details
    };
  }

  public async getWebhooks(): Promise<RealmAppServiceWebhookBasics[]> {
    const response = await fetch(
      `${RealmApi.API_BASE_URL}/groups/${this.realmApp.getDetails().group_id}/apps/${this.realmApp.getDetails()._id}/services/${this.details._id}/incoming_webhooks`,
      {
        headers: this.realmApp.getRealm().getAuthHeaders()
      }
    );
    await assertResponseOk(response);

    const data: RealmAppServiceWebhookBasics[] = await response.json();
    return data;
  }

  public async getWebhook(webhookId: string): Promise<RealmAppServiceWebhookDetails> {
    const response = await fetch(
      `${RealmApi.API_BASE_URL}/groups/${this.realmApp.getDetails().group_id}/apps/${this.realmApp.getDetails()._id}/services/${this.details._id}/incoming_webhooks/${webhookId}`,
      {
        headers: this.realmApp.getRealm().getAuthHeaders()
      }
    );
    await assertResponseOk(response);

    const data: RealmAppServiceWebhookDetails = await response.json();
    return data;
  }

}