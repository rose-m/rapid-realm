import { parseFunctionSource } from './function-parser';
import { generateFunctionSource } from './generator';

export * from './types';
export const RealmLambda = {
  generateFunctionSource,
  parseFunctionSource
};
