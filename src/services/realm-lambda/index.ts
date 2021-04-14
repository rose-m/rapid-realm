import { generateFunctionSource } from './function-generator';
import { parseFunctionSource } from './function-parser';
import { parseQueryOrAggregation } from './query-parser';

export * from './types';
export const RealmLambda = {
  generateFunctionSource,
  parseFunctionSource,
  parseQueryOrAggregation
};
