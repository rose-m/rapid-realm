import { RealmAppApi } from './realm-app-api';
import { RealmAppServiceDetails } from './realm-app-service-api.types';

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

}