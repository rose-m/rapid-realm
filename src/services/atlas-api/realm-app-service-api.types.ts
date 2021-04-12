
export interface RealmAppServiceDetails {
  _id: string;
  name: string;
  type: 'mongodb-atlas' | 'http';
  version: number;
}

export interface RealmAppServiceWebhookDetails {
  name: string;
  function_source: string;
  respond_result: boolean;
  options: {
    secret: string;
    secretAsQueryParam: boolean;
  }
}