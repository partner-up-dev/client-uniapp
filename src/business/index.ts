import { APIClient } from "./api";
import * as v from "valibot";


export const V = {
  class<TSchema extends v.BaseSchema<any, any, any>>(schema: TSchema) {
    type Input = v.InferInput<TSchema>;
    type Output = v.InferOutput<TSchema>;

    class ValibotClass {
      // Expose schema on the constructor for BusinessWithAPI.parse
      static V = schema as TSchema;

      constructor(value: Input) {
        const parsed = v.parse(schema, value) as Output;
        Object.assign(this as object, parsed);
      }

      static schema() { return schema as TSchema; }

      static parse<T = InstanceType<typeof ValibotClass>>(data: unknown): T {
        const parsed = v.parse(schema, data) as Output;
        const instance = Object.create(this.prototype) as T;
        Object.assign(instance as object, parsed);
        return instance;
      }

      static async parseAsync<T = InstanceType<typeof ValibotClass>>(data: unknown): Promise<T> {
        const parsed = await v.parseAsync(schema, data) as Output;
        const instance = Object.create(this.prototype) as T;
        Object.assign(instance as object, parsed);
        return instance;
      }

      static safeParse<T = InstanceType<typeof ValibotClass>>(data: unknown) {
        const result = v.safeParse(schema, data);
        if (result.success) {
          const output = (result as any).output ?? (result as any).data;
          const instance = Object.create(this.prototype) as T;
          Object.assign(instance as object, output as Output);
          return { success: true as const, output: instance };
        }
        return result;
      }

      static parseJSON<T = InstanceType<typeof ValibotClass>>(json: string): T {
        const data = JSON.parse(json) as unknown;
        return (this as unknown as { parse(d: unknown): T }).parse(data);
      }
    }

    // Build an embedded schema that transforms parsed output into a class instance.
    // This ensures when used inside other Valibot schemas (e.g. v.object entries),
    // the resulting parsed value is an instance of the declared class.
    const embeddedSchema = v.pipe(
      schema,
      v.transform((parsed: Output) => {
        const inst = Object.create(ValibotClass.prototype) as Output;
        Object.assign(inst as object, parsed);
        return inst as unknown;
      })
    );

    // Make the class itself act like the transformed Valibot schema at runtime by copying
    // the embedded schema's properties onto the constructor function.
    Object.assign(ValibotClass, embeddedSchema);

    // Return the constructor intersected with a BaseSchema whose output is the instance type.
    return ValibotClass as unknown as v.BaseSchema<
      v.InferInput<TSchema>,
      Output,
      v.InferIssue<TSchema>
    > & {
      new(value: Input): Output;
      V: TSchema;
      schema(): TSchema;
      parse<T = InstanceType<typeof ValibotClass>>(data: unknown): T;
      parseAsync<T = InstanceType<typeof ValibotClass>>(data: unknown): Promise<T>;
      safeParse<T = InstanceType<typeof ValibotClass>>(data: unknown):
        | { success: true; output: T }
        | { success: false; issues: v.BaseIssue<unknown>[] };
      parseJSON<T = InstanceType<typeof ValibotClass>>(json: string): T;
    };
  }
};

// Public type alias for the constructor type returned by V.class
// This matches the structural type we cast to above, enabling other modules to refer to
// "typeof ValibotClass" without importing a concrete implementation.
export type ValibotClass<
  TSchema extends v.BaseSchema<any, any, any> = v.BaseSchema<any, any, any>
> = v.BaseSchema<
  v.InferInput<TSchema>,
  v.InferOutput<TSchema>,
  v.InferIssue<TSchema>
> & {
  new(value: v.InferInput<TSchema>): v.InferOutput<TSchema>;
  V: TSchema;
  schema(): TSchema;
  parse<T = InstanceType<any>>(data: unknown): T;
  parseAsync<T = InstanceType<any>>(data: unknown): Promise<T>;
  safeParse<T = InstanceType<any>>(data: unknown):
    | { success: true; output: T }
    | { success: false; issues: v.BaseIssue<unknown>[] };
  parseJSON<T = InstanceType<any>>(json: string): T;
};


export function nullable(schema: v.BaseSchema<any, any, any>) {
  return v.optional(v.nullable(schema), null);
}
