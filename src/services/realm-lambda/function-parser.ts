import { FunctionDescriptor } from './types';
import { FUNCTION_TEMPLATE_MARKER } from './function-generator';

const FUNCTION_MARKER_REGEX = new RegExp(`^\\s*${FUNCTION_TEMPLATE_MARKER}`);
const FUNCTION_DESCRIPTOR_REGEX = /\/\/\s*DESCRIPTOR>>(.+)$/m;

export function parseFunctionSource(source: string): FunctionDescriptor | undefined {
  if (!FUNCTION_MARKER_REGEX.test(source)) {
    return undefined;
  }
  const match = FUNCTION_DESCRIPTOR_REGEX.exec(source);
  if (!match) {
    return undefined;
  }

  try {
    return JSON.parse(match[1]);
  } catch (e) {
    console.error('Failed to parse function descriptor', e);
    console.error('Descriptor was', match[1]);
    return undefined;
  }
}