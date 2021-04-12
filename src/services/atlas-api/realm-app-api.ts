import { RealmApi } from './realm-api';

export class RealmAppApi {

  constructor(
    private readonly realmApi: RealmApi,
    private readonly groupId: string,
    private readonly appId: string
  ) {}

  public async getServices(): Promise<string[]> {
    return [];
  }

}