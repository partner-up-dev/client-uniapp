import * as v from 'valibot';

// ParseTarget: either a Valibot schema, any class constructor (e.g., returned by v.class(...)), or TableSchemaT
export type ParseTarget =
  | v.BaseSchema<any, any, any>
  | (abstract new (...args: any) => any)
  | { V: v.BaseSchema<any, any, any>; parse: (data: any) => any };

// Given a ParseTarget, infer the parsed output type
export type ParsedOf<S> =
  // If S is a TableSchemaT structure, infer from its parse method
  S extends { V: v.BaseSchema<any, any, any>; parse: (data: any) => infer R } ? R :
  // If S is a class constructor, infer its instance type
  S extends abstract new (...args: any) => infer I ? I :
  // If S is a Valibot schema, infer its output
  S extends v.BaseSchema<any, infer O, any> ? O :
  unknown;

/**
 * Data wrapper for PostgREST responses with lazy validation support.
 * Similar to Body in http-api.ts but adapted for PostgREST context.
 */
export class Data<S extends ParseTarget | undefined = undefined> {
  private readonly _raw: unknown;
  private readonly _schema?: S;

  constructor(raw: unknown, schema?: S) {
    this._raw = raw;
    this._schema = schema;
  }

  // Original payload from server, unmodified
  get raw(): unknown {
    return this._raw;
  }

  // Lazily-validated data via Valibot or ValibotClass; returns unknown when no schema provided
  get parsed(): ParsedOf<S> {
    if (this._schema) {
      const target = this._schema as ParseTarget;

      // Check if it's a TableSchemaT structure
      if (typeof target === 'object' && target !== null && 'V' in target && 'parse' in target) {
        return target.parse(this._raw) as ParsedOf<S>;
      }

      const maybeParse = (target as any)?.parse as ((d: unknown) => unknown) | undefined;
      // If provided target exposes a static parse (ValibotClass), prefer that
      if (typeof maybeParse === 'function') {
        return maybeParse.call(target as any, this._raw) as ParsedOf<S>;
      }
      // Otherwise, treat it as a Valibot schema
      return v.parse(target as v.BaseSchema<any, any, any>, this._raw) as ParsedOf<S>;
    }
    // No schema -> return raw as-is (unknown)
    return this._raw as ParsedOf<S>;
  }
}
