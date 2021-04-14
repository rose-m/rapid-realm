export type FunctionType = 'query' | 'aggregation';
export type FunctionVariableType = 'string' | 'number' | 'boolean' | 'any';

export interface FunctionVariable {
  name: string;
  type: FunctionVariableType;
  default: any;
}

export interface FunctionDescriptor {
  type: FunctionType;
  dataSource: string;
  database: string;
  collection: string;
  variables: FunctionVariable[];
  queryOrAggregation: string;
}

export interface QueryOrAggregationParseResult {
  type: FunctionType,
  variables: FunctionVariable[]
}