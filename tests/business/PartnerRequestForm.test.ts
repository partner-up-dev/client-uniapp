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

    await expect(form.validate()).resolves.toBeUndefined();
  });

  it("validates successfully with valid title only", async () => {
    const form = PartnerRequestForm.parse({
      title: "Valid Title",
      introduction: null,
    });

    await expect(form.validate()).resolves.toBeUndefined();
  });

  it("validates successfully with valid introduction only", async () => {
    const form = PartnerRequestForm.parse({
      title: null,
      introduction: "Valid introduction text",
    });

    await expect(form.validate()).resolves.toBeUndefined();
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

    await expect(form.validate()).rejects.toThrow("请填写标题或简介");
  });

  it("fails at parse when both title and introduction are empty strings", () => {
    expect(() => {
      PartnerRequestForm.parse({
        title: "",
        introduction: "",
      });
    }).toThrow();
  });

  it("validates title at minimum length boundary", async () => {
    const form = PartnerRequestForm.parse({
      title: "abc", // Exactly 3 characters
      introduction: null,
    });

    await expect(form.validate()).resolves.toBeUndefined();
  });

  it("validates title at maximum length boundary", async () => {
    const form = PartnerRequestForm.parse({
      title: "123456789012", // Exactly 12 characters
      introduction: null,
    });

    await expect(form.validate()).resolves.toBeUndefined();
  });

  it("validates introduction at minimum length boundary", async () => {
    const form = PartnerRequestForm.parse({
      title: null,
      introduction: "abc", // Exactly 3 characters
    });

    await expect(form.validate()).resolves.toBeUndefined();
  });

  it("validates introduction at maximum length boundary", async () => {
    const form = PartnerRequestForm.parse({
      title: null,
      introduction: "a".repeat(60), // Exactly 60 characters
    });

    await expect(form.validate()).resolves.toBeUndefined();
  });
});
