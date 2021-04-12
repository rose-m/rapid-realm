
export interface RealmAppServiceDetails {
    _id: string;
    name: string;
    type: 'mongodb-atlas' | 'http';
    version: number;
}