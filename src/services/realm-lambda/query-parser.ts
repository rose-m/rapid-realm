import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import { FunctionType, FunctionVariable, QueryOrAggregationParseResult } from './types';

const WRAPPER_VARIABLE = '__PARSE_WRAPPER__';

export function parseQueryOrAggregation(queryOrAggregation: string): QueryOrAggregationParseResult | undefined {
  let ast = acorn.parse(`const ${WRAPPER_VARIABLE} = ${queryOrAggregation};`, {
    ecmaVersion: 2017
  });

  let type: FunctionType | undefined;
  const variables: FunctionVariable[] = [];
  walk.ancestor(ast, {
    VariableDeclarator(node: any) {
      if (node.id?.name === WRAPPER_VARIABLE) {
        switch (node.init?.type) {
          case 'ArrayExpression':
            type = 'aggregation';
            break;
          case 'ObjectExpression':
            type = 'query'
            break;
          default:
            break;
        }
      }
    },
    Identifier(node: any, ancestors: any[]) {
      if (ignoreIdentifierParent(node, ancestors)) {
        return;
      }

      variables.push({
        name: node.name,
        type: 'any',
        default: undefined
      });
    }
  });

  if (type === undefined) {
    return undefined;
  }

  return {
    type,
    variables
  };
}

const IGNORED_IDENTIFIER_PARENT_TYPES = [
  'CallExpression'
];
function ignoreIdentifierParent(node: any, ancestors: any[]): boolean {
  if (!ancestors.length) {
    return false;
  }

  const hasFunctionParent = !!ancestors.find(n => n.type === 'FunctionExpression');
  if (hasFunctionParent) {
    return true;
  }

  const parent = ancestors[ancestors.length - 1];
  if (IGNORED_IDENTIFIER_PARENT_TYPES.includes(parent.type)) {
    return true;
  }

  switch (parent.type) {
    case 'Property':
      return parent.key === node;
  }

  return false;
}
