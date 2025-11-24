import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import TripPreferenceForm from "@/components/partner_request/trip/tripPreferenceForm/tripPreferenceForm.vue";
import { TripPreference } from "@/business/partner_request/trip";

describe("TripPreferenceForm Component", () => {
  it("renders trip preference fields", () => {
    const modelValue = TripPreference.parse({});
    const wrapper = mount(TripPreferenceForm, {
      props: {
        modelValue,
      },
    });

    expect(wrapper.text()).toContain("出行目的");
    expect(wrapper.text()).toContain("行李");
  });

  it("shows flight number field for airport purposes", () => {
    const modelValue = TripPreference.parse({
      purpose: "airport_dropoff",
    });
    const wrapper = mount(TripPreferenceForm, {
      props: {
        modelValue,
      },
    });

    expect(wrapper.text()).toContain("航班号");
  });

  it("shows railway number field for railway purposes", () => {
    const modelValue = TripPreference.parse({
      purpose: "railway_pickup",
    });
    const wrapper = mount(TripPreferenceForm, {
      props: {
        modelValue,
      },
    });

    expect(wrapper.text()).toContain("列车号");
  });

  it("does not show flight/railway fields for common purpose", () => {
    const modelValue = TripPreference.parse({
      purpose: "common",
    });
    const wrapper = mount(TripPreferenceForm, {
      props: {
        modelValue,
      },
    });

    expect(wrapper.text()).not.toContain("航班号");
    expect(wrapper.text()).not.toContain("列车号");
  });

  it("converts luggage count to volume", async () => {
    const modelValue = TripPreference.parse({});
    const wrapper = mount(TripPreferenceForm, {
      props: {
        modelValue,
      },
    });

    const component = wrapper.vm as any;
    component.handleLuggageInput(2);

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    const emittedValue = wrapper.emitted("update:modelValue")![0][0] as TripPreference;
    expect(emittedValue.luggage).toBe(40); // 2 pieces * 20L = 40L
  });

  it("validates luggage number is integer", async () => {
    const modelValue = TripPreference.parse({});
    const wrapper = mount(TripPreferenceForm, {
      props: {
        modelValue,
      },
    });

    const component = wrapper.vm as any;
    component.luggageNumber = 2.5; // Non-integer

    const result = await component.validate();
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("validates luggage number is not negative", async () => {
    const modelValue = TripPreference.parse({});
    const wrapper = mount(TripPreferenceForm, {
      props: {
        modelValue,
      },
    });

    const component = wrapper.vm as any;
    component.luggageNumber = -1;

    const result = await component.validate();
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("validates successfully with valid luggage number", async () => {
    const modelValue = TripPreference.parse({});
    const wrapper = mount(TripPreferenceForm, {
      props: {
        modelValue,
      },
    });

    const component = wrapper.vm as any;
    component.luggageNumber = 2;

    const result = await component.validate();
    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it("emits change event when luggage changes", async () => {
    const modelValue = TripPreference.parse({});
    const wrapper = mount(TripPreferenceForm, {
      props: {
        modelValue,
      },
    });

    const component = wrapper.vm as any;
    component.handleLuggageInput(1);

    expect(wrapper.emitted("change")).toBeTruthy();
  });

  it("emits change event when flight number changes", async () => {
    const modelValue = TripPreference.parse({
      purpose: "airport_dropoff",
    });
    const wrapper = mount(TripPreferenceForm, {
      props: {
        modelValue,
      },
    });

    const component = wrapper.vm as any;
    component.handleFlightInput("CA1234");

    expect(wrapper.emitted("change")).toBeTruthy();
  });

  it("emits change event when railway number changes", async () => {
    const modelValue = TripPreference.parse({
      purpose: "railway_pickup",
    });
    const wrapper = mount(TripPreferenceForm, {
      props: {
        modelValue,
      },
    });

    const component = wrapper.vm as any;
    component.handleRailwayInput("G123");

    expect(wrapper.emitted("change")).toBeTruthy();
  });
});
