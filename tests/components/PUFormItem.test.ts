import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import PUFormItem from "@/components/common/PUFormItem/PUFormItem.vue";
import { computed, ref } from "vue";

describe("PUFormItem Component", () => {
  it("renders default slot content", () => {
    const wrapper = mount(PUFormItem, {
      props: {
        prop: "username",
      },
      slots: {
        default: '<input type="text" value="test input" />',
      },
    });

    expect(wrapper.find("input").exists()).toBe(true);
    expect(wrapper.find("input").element.value).toBe("test input");
  });

  it("shows error message when form errors are provided", () => {
    const wrapper = mount(PUFormItem, {
      props: {
        prop: "username",
      },
      global: {
        provide: {
          puFormErrors: computed(() => ({
            errors: {
              username: "用户名至少3个字符",
            },
          })),
        },
      },
    });

    expect(wrapper.find(".pu-form-item__error").exists()).toBe(true);
    expect(wrapper.find(".pu-form-item__error").text()).toBe("用户名至少3个字符");
  });

  it("hides error message when there are no errors", () => {
    const wrapper = mount(PUFormItem, {
      props: {
        prop: "username",
      },
      global: {
        provide: {
          puFormErrors: computed(() => ({
            errors: {},
          })),
        },
      },
    });

    expect(wrapper.find(".pu-form-item__error").exists()).toBe(false);
  });

  it("hides error message when prop is not set", () => {
    const wrapper = mount(PUFormItem, {
      global: {
        provide: {
          puFormErrors: computed(() => ({
            errors: {
              username: "用户名至少3个字符",
            },
          })),
        },
      },
    });

    expect(wrapper.find(".pu-form-item__error").exists()).toBe(false);
  });

  it("shows error for specific field only", () => {
    const wrapper = mount(PUFormItem, {
      props: {
        prop: "email",
      },
      global: {
        provide: {
          puFormErrors: computed(() => ({
            errors: {
              username: "用户名至少3个字符",
              email: "请输入有效的邮箱地址",
            },
          })),
        },
      },
    });

    expect(wrapper.find(".pu-form-item__error").exists()).toBe(true);
    expect(wrapper.find(".pu-form-item__error").text()).toBe("请输入有效的邮箱地址");
    expect(wrapper.find(".pu-form-item__error").text()).not.toContain("用户名");
  });

  it("renders without errors when not inside PUForm", () => {
    const wrapper = mount(PUFormItem, {
      props: {
        prop: "username",
      },
      slots: {
        default: '<input type="text" />',
      },
    });

    expect(wrapper.find(".pu-form-item__error").exists()).toBe(false);
    expect(wrapper.find("input").exists()).toBe(true);
  });
});
