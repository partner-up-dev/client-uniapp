import { describe, it, expect } from "vitest";
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

  it("fails validation when title is too short", async () => {
    const form = PartnerRequestForm.parse({
      title: "ab", // Only 2 characters, minimum is 3
      introduction: null,
    });

    await expect(form.validate()).rejects.toThrow("标题长度必须在 3-12 个字符之间");
  });

  it("fails validation when title is too long", async () => {
    const form = PartnerRequestForm.parse({
      title: "This is a very long title", // More than 12 characters
      introduction: null,
    });

    await expect(form.validate()).rejects.toThrow("标题长度必须在 3-12 个字符之间");
  });

  it("fails validation when introduction is too short", async () => {
    const form = PartnerRequestForm.parse({
      title: null,
      introduction: "ab", // Only 2 characters, minimum is 3
    });

    await expect(form.validate()).rejects.toThrow("简介长度必须在 3-60 个字符之间");
  });

  it("fails validation when introduction is too long", async () => {
    const form = PartnerRequestForm.parse({
      title: null,
      introduction: "a".repeat(61), // More than 60 characters
    });

    await expect(form.validate()).rejects.toThrow("简介长度必须在 3-60 个字符之间");
  });

  it("fails validation when both title and introduction are empty", async () => {
    const form = PartnerRequestForm.parse({
      title: null,
      introduction: null,
    });

    await expect(form.validate()).rejects.toThrow("请填写标题或简介");
  });

  it("fails validation when both title and introduction are empty strings", async () => {
    const form = PartnerRequestForm.parse({
      title: "",
      introduction: "",
    });

    await expect(form.validate()).rejects.toThrow("请填写标题或简介");
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
