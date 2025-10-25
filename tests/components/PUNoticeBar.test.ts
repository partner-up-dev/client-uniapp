import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import PUNoticeBar from "@/components/common/PUNoticeBar/PUNoticeBar.vue";

describe("PUNoticeBar Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("renders text correctly", () => {
    const wrapper = mount(PUNoticeBar, {
      props: {
        text: "Test notification",
      },
    });

    expect(wrapper.text()).toContain("Test notification");
  });

  it("renders with prefix icon", () => {
    const wrapper = mount(PUNoticeBar, {
      props: {
        text: "Test notification",
        prefix: "lightbulb",
      },
    });

    expect(wrapper.find(".i-mdi-lightbulb").exists()).toBe(true);
  });

  it("applies custom background color and text color", () => {
    const wrapper = mount(PUNoticeBar, {
      props: {
        text: "Test notification",
        backgroundColor: "#f6d77d",
        color: "#372a04",
      },
    });

    const noticeBar = wrapper.find(".pu-notice-bar");
    expect(noticeBar.attributes("style")).toContain("background-color: rgb(246, 215, 125)");
    expect(noticeBar.attributes("style")).toContain("color: rgb(55, 42, 4)");
  });

  it("shows close button when closeable is true", () => {
    const wrapper = mount(PUNoticeBar, {
      props: {
        text: "Test notification",
        closeable: true,
      },
    });

    expect(wrapper.find(".pu-notice-bar__close").exists()).toBe(true);
    expect(wrapper.find(".i-mdi-close").exists()).toBe(true);
  });

  it("emits close event when close button is clicked", async () => {
    const wrapper = mount(PUNoticeBar, {
      props: {
        text: "Test notification",
        closeable: true,
      },
    });

    await wrapper.find(".pu-notice-bar__close").trigger("click");

    expect(wrapper.emitted("close")).toBeTruthy();
    expect(wrapper.find(".pu-notice-bar").exists()).toBe(false);
  });

  it("emits click event when notice bar is clicked", async () => {
    const wrapper = mount(PUNoticeBar, {
      props: {
        text: "Test notification",
      },
    });

    await wrapper.find(".pu-notice-bar").trigger("click");

    expect(wrapper.emitted("click")).toBeTruthy();
  });

  it("renders horizontal scrollable text", () => {
    const wrapper = mount(PUNoticeBar, {
      props: {
        text: "Long notification text that needs to scroll",
        direction: "horizontal",
        scrollable: true,
      },
    });

    const textElement = wrapper.find(".pu-notice-bar__text");
    expect(textElement.classes()).toContain("pu-notice-bar__text--scrollable");
  });

  it("renders vertical text rotation with array", () => {
    const wrapper = mount(PUNoticeBar, {
      props: {
        text: ["First message", "Second message", "Third message"],
        direction: "vertical",
      },
    });

    const textElement = wrapper.find(".pu-notice-bar__text");
    expect(textElement.classes()).toContain("pu-notice-bar__text--vertical");
    expect(wrapper.text()).toContain("First message");
  });

  it("allows text wrapping when wrapable is true", () => {
    const wrapper = mount(PUNoticeBar, {
      props: {
        text: "Long notification text that should wrap",
        wrapable: true,
      },
    });

    expect(wrapper.find(".pu-notice-bar--wrapable").exists()).toBe(true);
  });

  it("hides prefix when not provided", () => {
    const wrapper = mount(PUNoticeBar, {
      props: {
        text: "Test notification",
      },
    });

    expect(wrapper.find(".pu-notice-bar__prefix").exists()).toBe(false);
  });

  it("hides close button when closeable is false", () => {
    const wrapper = mount(PUNoticeBar, {
      props: {
        text: "Test notification",
        closeable: false,
      },
    });

    expect(wrapper.find(".pu-notice-bar__close").exists()).toBe(false);
  });
});
