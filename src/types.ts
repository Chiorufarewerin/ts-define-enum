type UnionToIntersection<U> = (U extends any ? (arg: U) => void : never) extends (arg: infer I) => void ? I : never;

type LastInUnion<U> =
  UnionToIntersection<U extends any ? (x: U) => void : never> extends (x: infer L) => void ? L : never;

type UnionToTuple<U, T extends readonly any[] = []> = [U] extends [never]
  ? T
  : UnionToTuple<Exclude<U, LastInUnion<U>>, readonly [LastInUnion<U>, ...T]>;

type Fn = (...args: any[]) => any;

export type EnumValue = string | number;
export type EnumInput<Value extends EnumValue = EnumValue> = {
  readonly [Key in string]: Value | Fn;
};

type ExtractLiteralEnumValues<Value> = string extends Value
  ? number extends Value
    ? never
    : Exclude<Value, string>
  : number extends Value
    ? Exclude<Value, number>
    : Value;

type EnumFromInput<Input extends EnumInput> = {
  readonly [Key in keyof Input as ExtractLiteralEnumValues<Input[Key]> extends never
    ? never
    : Input[Key] extends EnumValue
      ? Key
      : never]: Extract<Input[Key], EnumValue>;
};

type MethodsFromInput<Input extends EnumInput> = {
  readonly [Key in keyof Input as Input[Key] extends Fn ? Key : never]: ReturnType<Extract<Input[Key], Fn>>;
};

type MetaFromEnum<Enum extends EnumFromInput<EnumInput>> = {
  readonly enum: [keyof Enum] extends [never] ? Readonly<Record<string, EnumValue>> : Enum;
  readonly keys: [keyof Enum] extends [never] ? readonly string[] : UnionToTuple<keyof Enum>;
  readonly values: [keyof Enum] extends [never] ? readonly EnumValue[] : UnionToTuple<Enum[keyof Enum]>;
  readonly is: (value: unknown) => value is [keyof Enum] extends [never] ? EnumValue : Enum[keyof Enum];
};

export type EnumOutput<Input extends EnumInput<EnumValue>> = MetaFromEnum<EnumFromInput<Input>> & EnumFromInput<Input>;

export type DefinedEnum<Input extends EnumInput<EnumValue> = Record<string, EnumValue>> = EnumOutput<Input> &
  MethodsFromInput<Input>;
