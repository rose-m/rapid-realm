import { parseFunctionSource } from './function-parser';
import { generateFunctionSource } from './function-generator';
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
        dataSource: 'mongodb-atlas',
        database: 'sample_mflix',
        collection: 'movies',
        queryOrAggregation: `{ type: type, year: { $gt: year } }`,
        variables: [
          { name: 'type', type: 'string', default: 'movie' },
          { name: 'year', type: 'number', default: undefined }
        ]
      };
      functionSource = generateFunctionSource(functionDescriptor);
    });

    it('extracts the proper FunctionDescriptor', () => {
      expect(parseFunctionSource(functionSource)).toEqual(functionDescriptor);
    });
  });

});