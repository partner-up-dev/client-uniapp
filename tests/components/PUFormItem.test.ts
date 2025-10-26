import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import PUFormItem from "@/components/common/PUFormItem/PUFormItem.vue";
import Cell from "@/components/common/cell/cell.vue";

describe("PUFormItem Component", () => {
  it("renders label correctly", () => {
    const wrapper = mount(PUFormItem, {
      props: {
        label: "用户名",
      },
    });

    expect(wrapper.text()).toContain("用户名");
  });

  it("shows required indicator when required is true", () => {
    const wrapper = mount(PUFormItem, {
      props: {
        label: "邮箱",
        required: true,
      },
    });

    expect(wrapper.find(".pu-form-item__required").exists()).toBe(true);
    expect(wrapper.find(".pu-form-item__required").text()).toBe("*");
  });

  it("hides required indicator when required is false", () => {
    const wrapper = mount(PUFormItem, {
      props: {
        label: "邮箱",
        required: false,
      },
    });

    expect(wrapper.find(".pu-form-item__required").exists()).toBe(false);
  });

  it("renders default slot content", () => {
    const wrapper = mount(PUFormItem, {
      props: {
        label: "测试",
      },
      slots: {
        default: '<input type="text" />',
      },
    });

    expect(wrapper.find("input").exists()).toBe(true);
  });

  it("passes prop to Cell component", () => {
    const wrapper = mount(PUFormItem, {
      props: {
        label: "用户名",
        prop: "username",
      },
    });

    const cell = wrapper.findComponent(Cell);
    expect(cell.props("formProp")).toBe("username");
  });

  it("passes type to Cell component", () => {
    const wrapper = mount(PUFormItem, {
      props: {
        label: "用户名",
        type: "horizontal",
      },
    });

    const cell = wrapper.findComponent(Cell);
    expect(cell.props("type")).toBe("horizontal");
  });

  it("passes size to Cell component", () => {
    const wrapper = mount(PUFormItem, {
      props: {
        label: "用户名",
        size: "medium",
      },
    });

    const cell = wrapper.findComponent(Cell);
    expect(cell.props("size")).toBe("medium");
  });

  it("passes prefixIcon to Cell component", () => {
    const wrapper = mount(PUFormItem, {
      props: {
        label: "电话",
        prefixIcon: "i-mdi-phone",
      },
    });

    const cell = wrapper.findComponent(Cell);
    expect(cell.props("prefixIcon")).toBe("i-mdi-phone");
  });

  it("passes suffixIcon to Cell component", () => {
    const wrapper = mount(PUFormItem, {
      props: {
        label: "设置",
        suffixIcon: "i-mdi-chevron-right",
      },
    });

    const cell = wrapper.findComponent(Cell);
    expect(cell.props("suffixIcon")).toBe("i-mdi-chevron-right");
  });

  it("emits click event when Cell is clicked", async () => {
    const wrapper = mount(PUFormItem, {
      props: {
        label: "测试",
      },
    });

    const cell = wrapper.findComponent(Cell);
    await cell.trigger("click");

    expect(wrapper.emitted("click")).toBeTruthy();
  });

  it("uses vertical type by default", () => {
    const wrapper = mount(PUFormItem, {
      props: {
        label: "测试",
      },
    });

    const cell = wrapper.findComponent(Cell);
    expect(cell.props("type")).toBe("vertical");
  });

  it("uses small size by default", () => {
    const wrapper = mount(PUFormItem, {
      props: {
        label: "测试",
      },
    });

    const cell = wrapper.findComponent(Cell);
    expect(cell.props("size")).toBe("small");
  });
});
