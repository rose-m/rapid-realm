import { RealmAppDetails } from './realm-app-api.types';

export interface RealmLoginResponse {
  access_token: string;
  refresh_token: string;
  user_id: string;
  device_id: string;
}

/**
 * `/​groups/​{groupId}/​apps/​{appId}`
 * Retrieve an application definition.
 */
export interface RealmGroupGetAppsResponse extends RealmAppDetails {
}
