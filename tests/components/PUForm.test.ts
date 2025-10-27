import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import PUForm from "@/components/common/PUForm/PUForm.vue";
import { PartnerRequestForm } from "@/business/partner_request/form";

describe("PUForm Component", () => {
  it("validates a ValibotFormClass instance successfully", async () => {
    const form = PartnerRequestForm.parse({
      title: "Valid Title",
      introduction: "Valid Introduction",
    });

    const wrapper = mount(PUForm, {
      props: {
        schema: form,
      },
    });

    const component = wrapper.vm as any;
    const result = await component.validate();

    expect(result).toHaveProperty("success");
    expect(result.success).toBe(true);
  });

  it("returns validation errors for invalid form", async () => {
    // Create a form with valid data first, then mutate it to be invalid
    const form = PartnerRequestForm.parse({
      title: "Valid Title",
      introduction: null,
    });
    
    // Mutate to invalid state
    (form as any).title = "ab"; // Too short

    const wrapper = mount(PUForm, {
      props: {
        schema: form,
      },
    });

    const component = wrapper.vm as any;
    const result = await component.validate();

    expect(result).toHaveProperty("success");
    expect(result.success).toBe(false);
    expect(result).toHaveProperty("errors");
    expect(Object.keys(result.errors).length).toBeGreaterThan(0);
  });

  it("handles schema without validate method gracefully", async () => {
    const plainObject = { title: "Test", introduction: "Test" };

    const wrapper = mount(PUForm, {
      props: {
        schema: plainObject as any,
      },
    });

    const component = wrapper.vm as any;
    const result = await component.validate();

    expect(result).toHaveProperty("success");
    expect(result.success).toBe(false);
    expect(result.errors).toHaveProperty("_form");
  });
});
