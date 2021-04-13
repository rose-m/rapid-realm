import { parseFunctionSource } from './function-parser';
import { generateFunctionSource } from './function-generator';

export * from './types';
export const RealmLambda = {
  generateFunctionSource,
  parseFunctionSource
};
