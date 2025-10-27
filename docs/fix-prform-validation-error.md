# Fix for `PRFormRef.value?.validate().then is not a function` Error

## Problem Summary

The error occurred in `src/pages/partner_request/create_end/create_end.vue` at line 152:

```typescript
PRFormRef.value?.validate().then((result) => {
  // ...
});
```

The error message was: `.then is not a function`, indicating that `validate()` was not returning a Promise.

## Root Causes

### 1. ValibotFormClass.validate() Logic Bug

**File**: `src/business/index.ts`, lines 212-285

**Issue**: The `validate()` method had a conditional logic error where:
- It first validated against the schema and collected errors
- Then called `_subclassValidate()`
- **BUG**: If `_subclassValidate()` returned `success: true`, it would return that result directly, **ignoring all schema validation errors**

**Code Before**:
```typescript
return this._subclassValidate().then((subclassValidateResult) => {
  if (!subclassValidateResult.success) {
    // Only process sub-validations when subclassValidate fails
    // ...
  } else {
    return subclassValidateResult;  // ❌ Ignores schema validation errors!
  }
});
```

**Fix**: Always merge schema errors with subclass validation errors and sub-component validation errors:
```typescript
return this._subclassValidate().then((subclassValidateResult) => {
  // Merge subclass validation errors with schema validation errors
  for (const errorKey in subclassValidateResult.errors) {
    if (!errors[errorKey]) {
      errors[errorKey] = [];
    }
    errors[errorKey].push(...subclassValidateResult.errors[errorKey]);
  }
  
  // Collect all validate promises from child components
  const subValidatePromises = [];
  
  for (const key in this) {
    const value = (this as any)[key];
    if (value && typeof value === 'object' && typeof value.validate === 'function') {
      subValidatePromises.push(
        value.validate().then((subResult) => {
          // Prefix sub-component errors with the property key
          const prefixedErrors = {};
          for (const errorKey in subResult.errors) {
            prefixedErrors[`${key}.${errorKey}`] = subResult.errors[errorKey];
          }
          return { success: subResult.success, errors: prefixedErrors };
        })
      );
    }
  }
  
  // Wait for all sub-validations and merge their errors
  return Promise.all(subValidatePromises).then((subResults) => {
    let allSuccess = Object.keys(errors).length === 0;
    
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
});
```

### 2. PUForm.validateFormData() Implementation Issue

**File**: `src/components/common/PUForm/PUForm.vue`, lines 63-110

**Issue**: The method expected `schema` to have a `validate()` method, but:
- It checked `typeof schema.validate !== "function"` and would fail early
- When schema.validate() was called, it expected Valibot issues format but got a different format from ValibotFormClass.validate()

**Code Before**:
```typescript
if (!schema || typeof schema.validate !== "function") {
  return Promise.resolve({
    success: false,
    errors: { _form: "Invalid schema configuration" },
  });
}

return schema.validate().then((result) => {
  // Expected result.issues (Valibot format)
  // But got result.errors (ValibotFormClass format)
});
```

**Fix**: Properly handle ValibotFormClass instances and convert error formats:
```typescript
if (!schema) {
  return Promise.resolve({
    success: false,
    errors: { _form: "Invalid schema configuration" },
  });
}

// Check if schema is a ValibotFormClass instance with validate method
if (typeof schema.validate === "function") {
  return schema.validate().then((result: { success: boolean; errors: Record<string, string[]> }) => {
    if (result.success) {
      return {
        success: true,
        validatedForm: schema as T,
      };
    }

    // Convert errors from Record<string, string[]> to Record<string, string>
    const errors: Record<string, string> = {};
    for (const key in result.errors) {
      errors[key] = result.errors[key].join(", ");
    }

    formErrors.value = errors;

    return {
      success: false,
      errors,
    };
  });
}
```

### 3. create_end.vue Form Initialization Issue

**File**: `src/pages/partner_request/create_end/create_end.vue`, line 59

**Issue**: Form was initialized as an empty object instead of a proper ValibotFormClass instance:
```typescript
const form = ref({});  // ❌ Plain object without validate() method
```

**Fix**: Initialize with a proper form class instance using `createFormByType()`:
```typescript
import { createFormByType } from "@/components/partner_request/PRForm/PRForm";

const form = ref(createFormByType(PRType.Undefined));  // ✅ Proper instance with validate()
```

Additionally, updated all form assignments in `onLoad` to use the appropriate form class constructors:
```typescript
// Before
form.value = PartnerRequestForm.parse({...});

// After - Helper function to get form class by type
function getFormClassByType(type: PRType) {
  switch (type) {
    case PRType.Commute:
      return CommutePRForm;
    case PRType.RideHailing:
      return RideHailingPRForm;
    default:
      return PartnerRequestForm;
  }
}

const FormClass = getFormClassByType(type);
form.value = FormClass.parse({...}) as any;  // Type assertion needed due to dynamic form types
```

**Note on type assertion**: The `as any` is necessary here because:
- `form` must accommodate multiple form types (PartnerRequestForm, CommutePRForm, RideHailingPRForm)
- The specific type depends on runtime value of `props.value.type`
- TypeScript cannot infer the correct union type from the dynamic switch
- This is a safe use of type assertion as the form type matches the PR type

## Changes Made

### 1. Fixed ValibotFormClass.validate() (src/business/index.ts)
- ✅ Always merge schema validation errors
- ✅ Always merge subclass validation errors  
- ✅ Always process sub-component validations
- ✅ Correctly compute overall success status

### 2. Fixed PUForm.validateFormData() (src/components/common/PUForm/PUForm.vue)
- ✅ Check for schema.validate() method existence properly
- ✅ Handle ValibotFormClass.validate() return format
- ✅ Convert error format from `Record<string, string[]>` to `Record<string, string>`
- ✅ Return proper error when schema doesn't have validate method

### 3. Fixed create_end.vue Form Initialization (src/pages/partner_request/create_end/create_end.vue)
- ✅ Import `createFormByType` helper
- ✅ Import `CommutePRForm` and `RideHailingPRForm` classes
- ✅ Initialize form with proper class instance
- ✅ Update all form assignments to use appropriate form classes

### 4. Added Tests
- ✅ Created `tests/components/PUForm.test.ts` to verify PUForm validation
- ✅ Updated `tests/business/PartnerRequestForm.test.ts` to match new validate() API

## Verification

The fix has been verified through:

1. **Unit Tests**: 
   - `tests/components/PUForm.test.ts` - All 3 tests passing
   - `tests/business/PartnerRequestForm.test.ts` - All 13 tests passing

2. **Key Test Cases**:
   - ✅ `validate()` returns a Promise
   - ✅ `validate().then()` works correctly
   - ✅ Valid form data passes validation
   - ✅ Invalid form data fails validation with proper errors
   - ✅ Plain objects without validate() method are handled gracefully

## Impact

This fix resolves a critical design flaw in the form validation system that would have caused:
- Runtime errors when calling validate() on forms
- Silent validation failures due to ignored schema errors
- Inconsistent validation behavior across different form types

The fix ensures:
- ✅ All validation errors are properly collected and reported
- ✅ Form validation returns Promises consistently
- ✅ Form instances are properly initialized with validate() methods
- ✅ Error handling is robust and prevents runtime failures
