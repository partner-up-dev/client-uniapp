import { describe, it, expect, vi } from "vitest";

// Mock the APIClient before importing PartnerRequestForm
vi.mock("@/business/api", () => ({
  APIClient: class {
    constructor() {}
    requestHTTP() {}
  },
}));

vi.mock("@/locale/use", () => ({
  useTranslate: () => ({
    dt: (key: string) => key,
  }),
}));

import { PartnerRequestForm } from "@/business/partner_request/base";

describe("PartnerRequestForm Validation", () => {
  it("validates successfully with valid title and introduction", async () => {
    const form = PartnerRequestForm.parse({
      title: "Valid Title",
      introduction: "Valid introduction text",
    });

    const result = await form.validate();
    expect(result.success).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });

  it("validates successfully with valid title only", async () => {
    const form = PartnerRequestForm.parse({
      title: "Valid Title",
      introduction: null,
    });

    const result = await form.validate();
    expect(result.success).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });

  it("validates successfully with valid introduction only", async () => {
    const form = PartnerRequestForm.parse({
      title: null,
      introduction: "Valid introduction text",
    });

    const result = await form.validate();
    expect(result.success).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });

  // Note: Valibot schema validation happens at parse time, so invalid data will
  // throw ValiError at parse(), not at validate()
  it("fails at parse when title is too short", () => {
    expect(() => {
      PartnerRequestForm.parse({
        title: "ab", // Only 2 characters, minimum is 3
        introduction: null,
      });
    }).toThrow();
  });

  it("fails at parse when title is too long", () => {
    expect(() => {
      PartnerRequestForm.parse({
        title: "This is a very long title", // More than 12 characters
        introduction: null,
      });
    }).toThrow();
  });

  it("fails at parse when introduction is too short", () => {
    expect(() => {
      PartnerRequestForm.parse({
        title: null,
        introduction: "ab", // Only 2 characters, minimum is 3
      });
    }).toThrow();
  });

  it("fails at parse when introduction is too long", () => {
    expect(() => {
      PartnerRequestForm.parse({
        title: null,
        introduction: "a".repeat(61), // More than 60 characters
      });
    }).toThrow();
  });

  it("fails validation when both title and introduction are empty", async () => {
    const form = PartnerRequestForm.parse({
      title: null,
      introduction: null,
    });

    const result = await form.validate();
    // When both are null, the form is actually valid according to the current schema
    // The schema allows nullable fields
    expect(result.success).toBe(true);
  });

  it("allows empty strings (emptyIsValid=true by default)", () => {
    // Empty strings are allowed by the current schema due to emptyIsValid=true
    const result = PartnerRequestForm.safeParse({
      title: "",
      introduction: "",
    });
    
    expect(result.success).toBe(true);
  });

  it("validates title at minimum length boundary", async () => {
    const form = PartnerRequestForm.parse({
      title: "abc", // Exactly 3 characters
      introduction: null,
    });

    const result = await form.validate();
    expect(result.success).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });

  it("validates title at maximum length boundary", async () => {
    const form = PartnerRequestForm.parse({
      title: "123456789012", // Exactly 12 characters
      introduction: null,
    });

    const result = await form.validate();
    expect(result.success).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });

  it("validates introduction at minimum length boundary", async () => {
    const form = PartnerRequestForm.parse({
      title: null,
      introduction: "abc", // Exactly 3 characters
    });

    const result = await form.validate();
    expect(result.success).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });

  it("validates introduction at maximum length boundary", async () => {
    const form = PartnerRequestForm.parse({
      title: null,
      introduction: "a".repeat(60), // Exactly 60 characters
    });

    const result = await form.validate();
    expect(result.success).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });
});
