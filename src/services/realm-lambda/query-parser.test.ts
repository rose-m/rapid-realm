import { parseQueryOrAggregation } from './query-parser';

describe('Query Parser', () => {

  describe('with invalid scripts', () => {
    it('returns undefined', () => {
      [
        'console.log("test")',
        'function() { const test = "miau"; }'
      ].forEach(code => {
        expect(
          parseQueryOrAggregation(code)
        ).toBeUndefined();
      })
    });

    it('fails on syntax errors', () => {
      expect(() => parseQueryOrAggregation(
        `{ name: "test", count: { $gt: } }`
      )).toThrow(/Unexpected token/);
    })
  });

  describe('for queries', () => {
    it('handles queries without variables', () => {
      const result = parseQueryOrAggregation(
        `{ name: "test", count: { $gt: 42 } }`
      );
      expect(result).toEqual({
        type: 'query',
        variables: []
      });
    });
    it('handles queries with variables', () => {
      const result = parseQueryOrAggregation(
        `{ name: nameVar, count: { $gt: num } }`
      );
      expect(result).toEqual({
        type: 'query',
        variables: [
          { name: 'nameVar', type: 'any', default: undefined },
          { name: 'num', type: 'any', default: undefined }
        ]
      });
    });
    it('handles complex queries with functions', () => {
      const result = parseQueryOrAggregation(
        `{ name: nameVar, count: { $where: function() { while (innerVar) {} } } }`
      );
      expect(result).toEqual({
        type: 'query',
        variables: [
          { name: 'nameVar', type: 'any', default: undefined }
        ]
      });
    });
  });

  describe('for aggregations', () => {
    it('handles aggregations without variables', () => {
      const result = parseQueryOrAggregation(
        `[{ $match: { name: "test", count: { $gt: 42 } } }, { otherStage: "test" }]`
      );
      expect(result).toEqual({
        type: 'aggregation',
        variables: []
      });
    });
    it('handles aggregations with variables', () => {
      const result = parseQueryOrAggregation(
        `[{ $match: { name: nameVar, count: { $gt: num } } }, { otherStage: "test" }]`
      );
      expect(result).toEqual({
        type: 'aggregation',
        variables: [
          { name: 'nameVar', type: 'any', default: undefined },
          { name: 'num', type: 'any', default: undefined }
        ]
      });
    });
    it('handles complex aggregations with functions', () => {
      const result = parseQueryOrAggregation(
        `[{ $match: { name: nameVar, count: { $where: function() { while (innerVar) {} } } } }]`
      );
      expect(result).toEqual({
        type: 'aggregation',
        variables: [
          { name: 'nameVar', type: 'any', default: undefined }
        ]
      });
    });
  });
});
