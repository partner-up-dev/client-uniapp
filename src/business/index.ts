import * as v from "valibot";


export const V = {
  class<TSchema extends v.BaseSchema<any, any, any>>(schema: TSchema) {
    type Input = v.InferInput<TSchema>;
    type Output = v.InferOutput<TSchema>;

    // Check if the schema is an array schema
    const isArraySchema = (schema as any).type === 'array';

    class ValibotClass {
      // Expose schema on the constructor for BusinessWithAPI.parse
      static V = schema as TSchema;

      constructor(value: Input) {
        const parsed = v.parse(schema, value) as Output;

        if (isArraySchema && Array.isArray(parsed)) {
          // For array schemas, convert this to an array-like object
          // Copy array elements
          for (let i = 0; i < parsed.length; i++) {
            (this as any)[i] = parsed[i];
          }
          (this as any).length = parsed.length;
        } else {
          Object.assign(this as object, parsed);
        }
      }

      static schema() { return schema as TSchema; }

      static parse<T = InstanceType<typeof ValibotClass>>(data: unknown): T {
        const parsed = v.parse(schema, data) as Output;

        if (isArraySchema && Array.isArray(parsed)) {
          // For array schemas, copy array elements to a new array and set prototype
          const instance = [...parsed] as T;
          Object.setPrototypeOf(instance, this.prototype);
          return instance;
        } else {
          const instance = Object.create(this.prototype) as T;
          Object.assign(instance as object, parsed);
          return instance;
        }
      }

      static async parseAsync<T = InstanceType<typeof ValibotClass>>(data: unknown): Promise<T> {
        const parsed = await v.parseAsync(schema, data) as Output;

        if (isArraySchema && Array.isArray(parsed)) {
          // For array schemas, copy array elements to a new array and set prototype
          const instance = [...parsed] as T;
          Object.setPrototypeOf(instance, this.prototype);
          return instance;
        } else {
          const instance = Object.create(this.prototype) as T;
          Object.assign(instance as object, parsed);
          return instance;
        }
      }

      static safeParse<T = InstanceType<typeof ValibotClass>>(data: unknown) {
        const result = v.safeParse(schema, data);
        if (result.success) {
          const output = (result as any).output ?? (result as any).data;

          if (isArraySchema && Array.isArray(output)) {
            // For array schemas, copy array elements to a new array and set prototype
            const instance = [...output] as T;
            Object.setPrototypeOf(instance, this.prototype);
            return { success: true as const, output: instance };
          } else {
            const instance = Object.create(this.prototype) as T;
            Object.assign(instance as object, output as Output);
            return { success: true as const, output: instance };
          }
        }
        return result;
      }

      static parseJSON<T = InstanceType<typeof ValibotClass>>(json: string): T {
        const data = JSON.parse(json) as unknown;
        return (this as unknown as { parse(d: unknown): T }).parse(data);
      }

      static extend<TExtendSchema extends v.BaseSchema<any, any, any>>(
        this: typeof ValibotClass,
        extendSchema: TExtendSchema
      ) {
        // Get the parent schema
        const parentSchema = (this as any).V as TSchema;

        // Merge the schemas using Valibot's intersect
        const mergedSchema = v.intersect([parentSchema, extendSchema]);

        // Store parent class reference
        const ParentClass = this;

        // Create a new extended class
        class ExtendedClass {
          static V = mergedSchema as any;

          constructor(value: any) {
            const parsed = v.parse(mergedSchema, value);
            // Use this.constructor.prototype to support further subclassing
            const instance = Object.create((this.constructor as any).prototype);
            Object.assign(instance, parsed);
            return instance as any;
          }

          static schema() { return mergedSchema as any; }

          static parse<T = InstanceType<typeof ExtendedClass>>(data: unknown): T {
            const parsed = v.parse(mergedSchema, data);
            const instance = Object.create(this.prototype) as T;
            Object.assign(instance as object, parsed);
            return instance;
          }

          static async parseAsync<T = InstanceType<typeof ExtendedClass>>(data: unknown): Promise<T> {
            const parsed = await v.parseAsync(mergedSchema, data);
            const instance = Object.create(this.prototype) as T;
            Object.assign(instance as object, parsed);
            return instance;
          }

          static safeParse<T = InstanceType<typeof ExtendedClass>>(data: unknown) {
            const result = v.safeParse(mergedSchema, data);
            if (result.success) {
              const output = (result as any).output ?? (result as any).data;
              const instance = Object.create(this.prototype) as T;
              Object.assign(instance as object, output);
              return { success: true as const, output: instance };
            }
            return result;
          }

          static parseJSON<T = InstanceType<typeof ExtendedClass>>(json: string): T {
            const data = JSON.parse(json) as unknown;
            return this.parse(data);
          }

          static extend<TExtendSchema2 extends v.BaseSchema<any, any, any>>(
            extendSchema: TExtendSchema2
          ): any {
            return ParentClass.extend.call(this, extendSchema);
          }
        }

        // Set up prototype chain to inherit instance methods from parent
        Object.setPrototypeOf(ExtendedClass.prototype, ParentClass.prototype);
        // Set up static method inheritance
        Object.setPrototypeOf(ExtendedClass, ParentClass);

        // Build an embedded schema for the extended class
        const embeddedExtendedSchema = v.pipe(
          mergedSchema,
          v.transform((parsed: any) => {
            if (isArraySchema && Array.isArray(parsed)) {
              // For array schemas, set the prototype to the extended class prototype
              Object.setPrototypeOf(parsed, ExtendedClass.prototype);
              return parsed;
            } else {
              const inst = Object.create(ExtendedClass.prototype);
              Object.assign(inst, parsed);
              return inst;
            }
          })
        );

        // Copy embedded schema properties onto ExtendedClass
        Object.assign(ExtendedClass, embeddedExtendedSchema);

        return ExtendedClass as unknown as v.BaseSchema<
          v.InferInput<typeof mergedSchema>,
          v.InferOutput<TSchema> & v.InferOutput<TExtendSchema>,
          v.InferIssue<typeof mergedSchema>
        > & {
          new(value: v.InferInput<typeof mergedSchema>): v.InferOutput<TSchema> & v.InferOutput<TExtendSchema>;
          V: typeof mergedSchema;
          schema(): typeof mergedSchema;
          parse<T = InstanceType<typeof ExtendedClass>>(data: unknown): T;
          parseAsync<T = InstanceType<typeof ExtendedClass>>(data: unknown): Promise<T>;
          safeParse<T = InstanceType<typeof ExtendedClass>>(data: unknown):
            | { success: true; output: T }
            | { success: false; issues: v.BaseIssue<unknown>[] };
          parseJSON<T = InstanceType<typeof ExtendedClass>>(json: string): T;
          extend<TExtendSchema2 extends v.BaseSchema<any, any, any>>(
            extendSchema: TExtendSchema2
          ): any;
        };
      }
    }

    // For array schemas, set up prototype chain to inherit from Array
    if (isArraySchema) {
      Object.setPrototypeOf(ValibotClass.prototype, Array.prototype);
    }

    // Build an embedded schema that transforms parsed output into a class instance.
    // This ensures when used inside other Valibot schemas (e.g. v.object entries),
    // the resulting parsed value is an instance of the declared class.
    const embeddedSchema = v.pipe(
      schema,
      v.transform((parsed: Output) => {
        if (isArraySchema && Array.isArray(parsed)) {
          // For array schemas, create a new array with the class prototype
          const instance = [...parsed];
          Object.setPrototypeOf(instance, ValibotClass.prototype);
          return instance as unknown;
        } else {
          const inst = Object.create(ValibotClass.prototype) as Output;
          Object.assign(inst as object, parsed);
          return inst as unknown;
        }
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
      extend<TExtendSchema extends v.BaseSchema<any, any, any>>(
        extendSchema: TExtendSchema
      ): v.BaseSchema<
        v.InferInput<v.IntersectSchema<[TSchema, TExtendSchema], undefined>>,
        Output & v.InferOutput<TExtendSchema>,
        v.InferIssue<v.IntersectSchema<[TSchema, TExtendSchema], undefined>>
      > & {
        new(value: v.InferInput<v.IntersectSchema<[TSchema, TExtendSchema], undefined>>): Output & v.InferOutput<TExtendSchema>;
        V: v.IntersectSchema<[TSchema, TExtendSchema], undefined>;
        schema(): v.IntersectSchema<[TSchema, TExtendSchema], undefined>;
        parse<T = any>(data: unknown): T;
        parseAsync<T = any>(data: unknown): Promise<T>;
        safeParse<T = any>(data: unknown):
          | { success: true; output: T }
          | { success: false; issues: v.BaseIssue<unknown>[] };
        parseJSON<T = any>(json: string): T;
        extend<TExtendSchema2 extends v.BaseSchema<any, any, any>>(
          extendSchema: TExtendSchema2
        ): any;
      };
    };
  },

  formClass<TSchema extends v.BaseSchema<any, any, any>>(schema: TSchema) {
    type Input = v.InferInput<TSchema>;
    type Output = v.InferOutput<TSchema>;
    type ValidationResult = { success: boolean; errors: Record<string, string[]> };

    // First create the base class using V.class
    const BaseClass = V.class(schema);

    class ValibotFormClass extends (BaseClass as any) {
      /**
       * Validate the current instance data against the schema
       * and call _sub_validate on child components for complex validation
       * @returns Promise with validation result containing success status and errors
       */
      public validate(): Promise<ValidationResult> {
        const errors: Record<string, string[]> = {};

        // First, validate against the schema
        const result = v.safeParse(schema, this);

        if (!result.success) {
          // Convert Valibot issues to error format
          for (const issue of result.issues) {
            const path = issue.path?.map((p: any) => p.key).join('.') || '_root';
            if (!errors[path]) {
              errors[path] = [];
            }
            errors[path].push(issue.message);
          }
        }

        return this._subclassValidate().then((subclassValidateResult) => {
          if (subclassValidateResult.success) {
            // Collect all _sub_validate promises from child components
            const subValidatePromises: Promise<ValidationResult>[] = [];

            // Helper to add validation promise with prefixed errors
            const addValidationPromise = (validateFn: () => Promise<ValidationResult>, prefix: string) => {
              subValidatePromises.push(
                validateFn().then((subResult) => {
                  const prefixedErrors: Record<string, string[]> = {};
                  for (const errorKey in subResult.errors) {
                    prefixedErrors[`${prefix}.${errorKey}`] = subResult.errors[errorKey];
                  }
                  return { success: subResult.success, errors: prefixedErrors };
                })
              );
            };

            // Iterate through all properties to find components with validate method
            for (const key in this) {
              const value = (this as any)[key];

              if (Array.isArray(value)) {
                // Handle array: iterate through elements
                value.forEach((element, index) => {
                  if (element && typeof element === 'object' && typeof element.validate === 'function') {
                    addValidationPromise(() => element.validate(), `${key}[${index}]`);
                  }
                });
              } else if (value && typeof value === 'object' && typeof value.validate === 'function') {
                // Handle single object
                addValidationPromise(() => value.validate(), key);
              }
            }

            // If no sub-validations, return immediately
            if (subValidatePromises.length === 0) {
              return Promise.resolve({
                success: Object.keys(errors).length === 0,
                errors,
              });
            }

            // Wait for all sub-validations to complete
            return Promise.all(subValidatePromises).then((subResults) => {
              let allSuccess = Object.keys(errors).length === 0;
              // Merge sub-validation errors
              for (const subResult of subResults) {
                if (!subResult.success) {
                  allSuccess = false;
                }
                for (const errorKey in subResult.errors) {
                  if (!errors[errorKey]) {
                    errors[errorKey] = [];
                  }
                  errors[errorKey].push(...subResult.errors[errorKey]);
                }
              }

              return {
                success: allSuccess,
                errors,
              };
            });
          }
          else {
            return Promise.resolve(subclassValidateResult);
          }
        });
      }

      protected _subclassValidate(): Promise<ValidationResult> {
        return Promise.resolve({ success: true, errors: {} });
      }
    }

    // Check if the schema is an array schema
    const isArraySchema = (schema as any).type === 'array';

    // Copy the embedded schema properties
    const embeddedSchema = v.pipe(
      schema,
      v.transform((parsed: Output) => {
        if (isArraySchema && Array.isArray(parsed)) {
          // For array schemas, set the prototype to the form class prototype
          Object.setPrototypeOf(parsed, ValibotFormClass.prototype);
          return parsed as unknown;
        } else {
          const inst = Object.create(ValibotFormClass.prototype) as Output;
          Object.assign(inst as object, parsed);
          return inst as unknown;
        }
      })
    );

    Object.assign(ValibotFormClass, embeddedSchema);

    return ValibotFormClass as unknown as v.BaseSchema<
      v.InferInput<TSchema>,
      Output & { validate(): Promise<{ success: boolean; errors: Record<string, string[]> }> },
      v.InferIssue<TSchema>
    > & {
      new(value: Input): Output & { validate(): Promise<{ success: boolean; errors: Record<string, string[]> }> };
      V: TSchema;
      schema(): TSchema;
      parse<T = InstanceType<typeof ValibotFormClass>>(data: unknown): T;
      parseAsync<T = InstanceType<typeof ValibotFormClass>>(data: unknown): Promise<T>;
      safeParse<T = InstanceType<typeof ValibotFormClass>>(data: unknown):
        | { success: true; output: T }
        | { success: false; issues: v.BaseIssue<unknown>[] };
      parseJSON<T = InstanceType<typeof ValibotFormClass>>(json: string): T;
      extend<TExtendSchema extends v.BaseSchema<any, any, any>>(
        extendSchema: TExtendSchema
      ): v.BaseSchema<
        v.InferInput<v.IntersectSchema<[TSchema, TExtendSchema], undefined>>,
        Output & v.InferOutput<TExtendSchema> & { validate(): Promise<{ success: boolean; errors: Record<string, string[]> }> },
        v.InferIssue<v.IntersectSchema<[TSchema, TExtendSchema], undefined>>
      > & {
        new(value: v.InferInput<v.IntersectSchema<[TSchema, TExtendSchema], undefined>>): Output & v.InferOutput<TExtendSchema> & { validate(): Promise<{ success: boolean; errors: Record<string, string[]> }> };
        V: v.IntersectSchema<[TSchema, TExtendSchema], undefined>;
        schema(): v.IntersectSchema<[TSchema, TExtendSchema], undefined>;
        parse<T = any>(data: unknown): T;
        parseAsync<T = any>(data: unknown): Promise<T>;
        safeParse<T = any>(data: unknown):
          | { success: true; output: T }
          | { success: false; issues: v.BaseIssue<unknown>[] };
        parseJSON<T = any>(json: string): T;
        extend<TExtendSchema2 extends v.BaseSchema<any, any, any>>(
          extendSchema: TExtendSchema2
        ): any;
      };
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
  extend<TExtendSchema extends v.BaseSchema<any, any, any>>(
    extendSchema: TExtendSchema
  ): ValibotClass<v.IntersectSchema<[TSchema, TExtendSchema], undefined>>;
};

// Public type alias for the constructor type returned by V.formClass
// This extends ValibotClass with the validate method for form validation
export type ValibotFormClass<
  TSchema extends v.BaseSchema<any, any, any> = v.BaseSchema<any, any, any>
> = v.BaseSchema<
  v.InferInput<TSchema>,
  v.InferOutput<TSchema> & { validate(): Promise<{ success: boolean; errors: Record<string, string[]> }> },
  v.InferIssue<TSchema>
> & {
  new(value: v.InferInput<TSchema>): v.InferOutput<TSchema> & { validate(): Promise<{ success: boolean; errors: Record<string, string[]> }> };
  V: TSchema;
  schema(): TSchema;
  parse<T = InstanceType<any>>(data: unknown): T;
  parseAsync<T = InstanceType<any>>(data: unknown): Promise<T>;
  safeParse<T = InstanceType<any>>(data: unknown):
    | { success: true; output: T }
    | { success: false; issues: v.BaseIssue<unknown>[] };
  parseJSON<T = InstanceType<any>>(json: string): T;
  extend<TExtendSchema extends v.BaseSchema<any, any, any>>(
    extendSchema: TExtendSchema
  ): ValibotFormClass<v.IntersectSchema<[TSchema, TExtendSchema], undefined>>;
};


export function nullable<T extends v.BaseSchema<any, any, any>>(schema: T) {
  return v.optional(v.nullable(schema), null);
}

export function instance<T extends ValibotClass>(cls: T) {
  // Accept either an existing instance of the class or a raw value that
  // the class (which itself behaves like a Valibot schema) can parse.
  const schema = v.pipe(
    v.any(),
    v.transform((i) => {
      if (typeof i === 'object' && i !== null) {
        return cls.parse(i);
      }
      return i;
    }),
    v.instance(cls as unknown as new (...args: any[]) => object),
  );

  return schema as unknown as v.BaseSchema<unknown, InstanceType<T>, v.BaseIssue<unknown>>;
}

/**
 * Extracts minLength and maxLength constraints from a Valibot string schema.
 */
export function limit_string(min?: number, max?: number, emptyIsValid = true) {
  const actions: v.BaseValidation<string, string, v.BaseIssue<unknown>>[] = [];

  if (min !== undefined && min > 0) {
    if (emptyIsValid) {
      // Allow empty strings to pass, only validate length if string is not empty
      actions.push(v.check((value) => value.length === 0 || value.length >= min, `String must be empty or at least ${min} characters long`));
    } else {
      actions.push(v.minLength(min));
    }
  }

  if (max !== undefined) {
    actions.push(v.maxLength(max));
  }

  return v.pipe(v.string(), ...actions);
}
