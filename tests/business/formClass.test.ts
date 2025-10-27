import { describe, it, expect } from "vitest";
import { V, type ValibotFormClass } from "@/business/index";
import * as v from "valibot";
import { PartnerRequestForm } from "@/business/partner_request/form";
import { PartnerApplicationForm } from "@/business/partner_request/application";
import { RouteItemForm, RouteForm, RouteItemDatetimeForm } from "@/business/base/route";
import { RideHailingPRForm } from "@/business/partner_request/ride_hailing";
import { CommutePRForm } from "@/business/partner_request/commute";

describe("V.formClass", () => {
  it("should have validate method on formClass instance", async () => {
    const TestForm: ValibotFormClass<v.ObjectSchema<{
      name: v.StringSchema<undefined>;
      age: v.NumberSchema<undefined>;
    }, undefined>> = V.formClass(v.object({
      name: v.string(),
      age: v.number(),
    }));

    const form = new TestForm({ name: "test", age: 25 });
    expect(typeof form.validate).toBe("function");

    const result = await form.validate();
    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("errors");
    expect(result.success).toBe(true);
  });

  it("should validate and return errors for invalid data", async () => {
    class TestForm extends V.formClass(v.object({
      name: v.pipe(v.string(), v.minLength(3)),
      age: v.pipe(v.number(), v.minValue(18)),
    })) { }

    const form = TestForm.parse({ name: "ab", age: 15 });
    const result = await form.validate();

    expect(result.success).toBe(false);
    expect(Object.keys(result.errors).length).toBeGreaterThan(0);
  });

  it("PartnerRequestForm should have validate method", async () => {
    const form = new PartnerRequestForm({
      title: "Test Title",
      introduction: "Test intro",
    });

    expect(typeof form.validate).toBe("function");
    const result = await form.validate();
    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("errors");
  });

  it("PartnerApplicationForm should have validate method", async () => {
    const form = PartnerApplicationForm.parse({
      partner_request: "test-id",
      sub_applications: [],
    });

    expect(typeof form.validate).toBe("function");
  });

  it("RouteItemForm should have validate method", async () => {
    const form = new RouteItemForm({});

    expect(typeof form.validate).toBe("function");
    const result = await form.validate();
    expect(result).toHaveProperty("success");
  });

  it("RouteForm should have validate method", async () => {
    const form = new RouteForm({});

    expect(typeof form.validate).toBe("function");
  });

  it("RouteItemDatetimeForm should have validate method", async () => {
    const form = new RouteItemDatetimeForm({});

    expect(typeof form.validate).toBe("function");
  });

  it("RideHailingPRForm (extended) should have validate method", async () => {
    const form = RideHailingPRForm.parse({
      title: "Test",
      introduction: "Test intro",
      route: { items: [] },
      trip_preference: {},
      ride_hailing_preference: { ride_types: [] },
    });

    expect(typeof form.validate).toBe("function");
    const result = await form.validate();
    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("errors");
  });

  it("CommutePRForm (extended) should have validate method", async () => {
    const form = CommutePRForm.parse({
      title: "Test",
      introduction: "Test intro",
      route: { items: [] },
      trip_preference: {},
      on_at: "09:00",
      off_at: "18:00",
      workdays: [],
      transportation: null,
    });

    expect(typeof form.validate).toBe("function");
    const result = await form.validate();
    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("errors");
  });

  it("should call _sub_validate on child components", async () => {
    // Create a mock child component with _sub_validate
    const mockChild = {
      _sub_validate: () => Promise.resolve({
        success: false,
        errors: { field: ["Child error"] },
      }),
    };

    class TestForm extends V.formClass(v.object({
      name: v.string(),
    })) { }

    const form = new TestForm({ name: "test" });
    (form as any).child = mockChild;

    const result = await form.validate();
    expect(result.success).toBe(false);
    expect(result.errors["child.field"]).toContain("Child error");
  });
});
