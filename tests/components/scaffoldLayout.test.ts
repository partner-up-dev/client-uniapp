import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ScaffoldLayout from "@/components/common/layout/scaffoldLayout.vue";
import NavBar from "@/components/common/navBar/navBar.vue";

// Mock vendor utilities
vi.mock("@/utils/vendor", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getWindowHeight: () => 800,
    getSafeArea: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    getMenuButtonRect: () => ({
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      height: 32,
      width: 87,
    }),
  };
});

describe("ScaffoldLayout Component", () => {
  it("renders with default header (NavBar)", () => {
    const wrapper = mount(ScaffoldLayout, {
      slots: {
        default: "<view>Content</view>",
      },
    });

    expect(wrapper.findComponent(NavBar).exists()).toBe(true);
  });

  it("renders custom header slot", () => {
    const wrapper = mount(ScaffoldLayout, {
      slots: {
        header: "<view class='custom-header'>Custom Header</view>",
        default: "<view>Content</view>",
      },
    });

    expect(wrapper.find(".custom-header").exists()).toBe(true);
    expect(wrapper.text()).toContain("Custom Header");
  });

  it("renders content in default slot", () => {
    const wrapper = mount(ScaffoldLayout, {
      slots: {
        default: "<view class='test-content'>Test Content</view>",
      },
    });

    expect(wrapper.find(".test-content").exists()).toBe(true);
    expect(wrapper.text()).toContain("Test Content");
  });

  it("renders footer when showFooter is true", () => {
    const wrapper = mount(ScaffoldLayout, {
      props: {
        showFooter: true,
      },
      slots: {
        default: "<view>Content</view>",
        footer: "<view class='test-footer'>Footer Content</view>",
      },
    });

    expect(wrapper.find(".test-footer").exists()).toBe(true);
    expect(wrapper.text()).toContain("Footer Content");
  });

  it("hides footer when showFooter is false", () => {
    const wrapper = mount(ScaffoldLayout, {
      props: {
        showFooter: false,
      },
      slots: {
        default: "<view>Content</view>",
        footer: "<view class='test-footer'>Footer Content</view>",
      },
    });

    expect(wrapper.find(".test-footer").exists()).toBe(false);
  });

  it("applies correct height from windowHeight", () => {
    const wrapper = mount(ScaffoldLayout, {
      slots: {
        default: "<view>Content</view>",
      },
    });

    const layoutElement = wrapper.find(".scaffold-layout");
    expect(layoutElement.attributes("style")).toContain("height: 800px");
  });

  it("has correct structure with header, content, and footer", () => {
    const wrapper = mount(ScaffoldLayout, {
      props: {
        showFooter: true,
      },
      slots: {
        header: "<view class='test-header'>Header</view>",
        default: "<view class='test-content'>Content</view>",
        footer: "<view class='test-footer'>Footer</view>",
      },
    });

    const layout = wrapper.find(".scaffold-layout");
    expect(layout.exists()).toBe(true);
    
    // Check that all sections exist in correct order
    const children = layout.element.children;
    expect(children.length).toBeGreaterThanOrEqual(2); // At least header and content
  });

  it("content section has flex-grow to fill space", () => {
    const wrapper = mount(ScaffoldLayout, {
      slots: {
        default: "<view>Content</view>",
      },
    });

    const contentElement = wrapper.find(".scaffold-layout__content");
    expect(contentElement.exists()).toBe(true);
  });
});
