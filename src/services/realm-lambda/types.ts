export type FunctionType = 'query' | 'aggregation';
export type FunctionVariableType = 'string' | 'number' | 'boolean' | 'any';

export interface FunctionVariable {
    name: string;
    type: FunctionVariableType;
    default: any;
}

export type FunctionDescriptor = QueryFunctionDescriptor | AggregationFunctionDescriptor;
interface FunctionDescriptorFields {
    type: FunctionType;
    database: string;
    collection: string;
    variables: FunctionVariable[];
}
export interface QueryFunctionDescriptor extends FunctionDescriptorFields {
    type: 'query';
    query: string;
}
export interface AggregationFunctionDescriptor extends FunctionDescriptorFields {
    type: 'aggregation';
    aggregation: string;
}
