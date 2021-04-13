import { parseFunctionSource } from './function-parser';
import { generateFunctionSource } from './generator';
import { FunctionDescriptor } from './types';

describe('Function Parser', () => {

  describe('with invalid source', () => {
    it('returns undefined', () => {
      expect(parseFunctionSource('somesource\nwhatever')).toBeUndefined();
    });
  });

  describe('with valid source', () => {
    let functionDescriptor: FunctionDescriptor;
    let functionSource: string;
    beforeAll(() => {
      functionDescriptor = {
        type: 'query',
        database: 'db1',
        collection: 'coll1',
        query: '{\nage: { $gt: count }\n}',
        variables: [
          { name: 'count', type: 'number', default: '42' }
        ]
      };
      functionSource = generateFunctionSource(functionDescriptor);
    });

    it('extracts the proper FunctionDescriptor', () => {
      expect(parseFunctionSource(functionSource)).toEqual(functionDescriptor);
    });
  });

});