import { DefinedEnum, EnumInput, EnumOutput, EnumValue } from './types.js';

export function defineEnum<Value extends EnumValue, Input extends EnumInput<Value>>(
  input: Input & ThisType<EnumOutput<Input>>,
): DefinedEnum<Input> {
  const output: any = {};

  for (const key in input) {
    if (Object.prototype.hasOwnProperty.call(input, key) && typeof input[key] !== 'function') {
      Object.defineProperty(output, key, { value: input[key], enumerable: true });
    }
  }

  const keys = Object.keys(output);
  const values = Object.values(output);
  const valueSet = new Set(values);

  Object.defineProperty(output, 'enum', { value: output });
  Object.defineProperty(output, 'keys', { value: keys });
  Object.defineProperty(output, 'values', { value: values });
  Object.defineProperty(output, 'is', { value: (value: unknown): boolean => valueSet.has(value) });

  for (const key in input) {
    if (Object.prototype.hasOwnProperty.call(input, key) && typeof input[key] === 'function') {
      Object.defineProperty(output, key, { value: input[key].call(output) });
    }
  }

  return output;
}
