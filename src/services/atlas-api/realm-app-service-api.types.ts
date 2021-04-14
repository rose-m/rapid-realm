
export enum RealmServiceType {
  MongoDbAtlas = 'mongodb-atlas',
  Http = 'http'
}
export interface RealmAppServiceDetails {
  _id: string;
  name: string;
  type: RealmServiceType;
  version: number;
}

export interface RealmAppServiceWebhookBasics {
  _id: string;
  name: string;
  last_modified: number;
}

export interface RealmAppServiceWebhookDetails extends RealmAppServiceWebhookBasics {
  create_user_on_auth: boolean;
  disable_arg_logs: boolean;
  fetch_custom_user_data: boolean;
  function_source: string;
  options: {
    httpMethod: 'ANY' | 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    validationMethod: 'NO_VALIDATION';
  };
  respond_result: boolean;
  run_as_authed_user: boolean;
  run_as_user_id: string;
  run_as_user_id_script_source: string;
  $url?: string;
}

export type RealmAppServiceWebhookPayload = Pick<RealmAppServiceWebhookDetails, 'name' | 'function_source' | 'respond_result' | 'options'>;
