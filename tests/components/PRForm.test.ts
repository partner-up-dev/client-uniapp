import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import PRForm from "@/components/partner_request/PRForm/PRForm.vue";
import { PartnerRequestForm } from "@/business/partner_request/base";
import { PRType } from "@/business/partner_request";
import { Route } from "@/business/base/route";
import { TripPreference } from "@/business/partner_request/trip";

describe("PRForm Component", () => {
  let baseForm: PartnerRequestForm;

  beforeEach(() => {
    baseForm = PartnerRequestForm.parse({
      title: "Test Title",
      introduction: "Test Introduction",
    });
  });

  it("renders basic form fields", () => {
    const wrapper = mount(PRForm, {
      props: {
        baseForm,
      },
    });

    expect(wrapper.find("#title-editor").exists()).toBe(true);
    expect(wrapper.find("#introduction-editor").exists()).toBe(true);
  });

  it("validates base form using PartnerRequestForm validation", async () => {
    const wrapper = mount(PRForm, {
      props: {
        baseForm: PartnerRequestForm.parse({
          title: "ab", // Too short
          introduction: null,
        }),
      },
    });

    const component = wrapper.vm as any;
    await expect(component.validate()).rejects.toThrow();
  });

  it("validates successfully with valid data", async () => {
    const wrapper = mount(PRForm, {
      props: {
        baseForm,
      },
    });

    const component = wrapper.vm as any;
    await expect(component.validate()).resolves.toBeUndefined();
  });

  it("shows route editor for ride_hailing type", () => {
    const route = Route.parse({ items: [] });
    const wrapper = mount(PRForm, {
      props: {
        baseForm,
        type: PRType.RideHailing,
        route,
      },
    });

    // Check that route accordion exists
    expect(wrapper.text()).toContain("路线信息");
  });

  it("shows trip preference editor for ride_hailing type", () => {
    const tripPreference = TripPreference.parse({});
    const wrapper = mount(PRForm, {
      props: {
        baseForm,
        type: PRType.RideHailing,
        tripPreference,
      },
    });

    // Check that trip preference accordion exists
    expect(wrapper.text()).toContain("出行偏好");
  });

  it("does not show route editor for undefined type", () => {
    const wrapper = mount(PRForm, {
      props: {
        baseForm,
      },
    });

    expect(wrapper.text()).not.toContain("路线信息");
  });

  it("emits update:route when route changes", async () => {
    const route = Route.parse({ items: [] });
    const wrapper = mount(PRForm, {
      props: {
        baseForm,
        type: PRType.RideHailing,
        route,
      },
    });

    // Trigger route change
    const component = wrapper.vm as any;
    component.handleRouteChange();

    expect(wrapper.emitted("update:route")).toBeTruthy();
  });

  it("emits update:tripPreference when trip preference changes", async () => {
    const tripPreference = TripPreference.parse({});
    const wrapper = mount(PRForm, {
      props: {
        baseForm,
        type: PRType.RideHailing,
        tripPreference,
      },
    });

    // Trigger trip preference change
    const component = wrapper.vm as any;
    component.handleTripPreferenceChange();

    expect(wrapper.emitted("update:tripPreference")).toBeTruthy();
  });

  it("updates form data when baseForm prop changes", async () => {
    const wrapper = mount(PRForm, {
      props: {
        baseForm,
      },
    });

    const newBaseForm = PartnerRequestForm.parse({
      title: "New Title",
      introduction: "New Introduction",
    });

    await wrapper.setProps({ baseForm: newBaseForm });

    const component = wrapper.vm as any;
    expect(component.form.title).toBe("New Title");
    expect(component.form.introduction).toBe("New Introduction");
  });
});
