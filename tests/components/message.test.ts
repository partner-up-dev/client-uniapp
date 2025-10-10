import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Message from "@/components/chat/message/message.vue";
import { Message as MessageClass } from "@/components/communication/message/message";

// 创建测试用的消息实例
function createTestMessage(overrides = {}) {
  return new MessageClass({
    _id: 1,
    chat: 100,
    created_at: new Date("2025-10-02 17:35"),
    created_by: "user-123",
    viewed: [],
    type: "plain",
    content: "Test message content",
    ...overrides,
  });
}

describe("Message Component", () => {
  it("renders plain text message correctly", () => {
    const message = createTestMessage();
    const wrapper = mount(Message, {
      props: {
        message,
        currentUserId: "current-user",
        showTime: true,
        showAvatar: true,
      },
    });

    // 检查消息内容是否正确渲染
    expect(wrapper.text()).toContain("Test message content");

    // 检查时间是否显示
    expect(wrapper.find(".message-time").exists()).toBe(true);

    // 检查头像是否显示（来自他人的消息）
    expect(wrapper.find(".message-avatar--other").exists()).toBe(true);

    // 检查是否有正确的布局类名
    expect(wrapper.find(".message-container--from-other").exists()).toBe(true);
  });

  it("renders self message correctly", () => {
    const message = createTestMessage({
      created_by: "current-user",
    });

    const wrapper = mount(Message, {
      props: {
        message,
        currentUserId: "current-user",
        showTime: true,
        showAvatar: true,
      },
    });

    // 检查是否有正确的发送者布局类名
    expect(wrapper.find(".message-container--from-me").exists()).toBe(true);

    // 检查头像位置（发送者的头像在右侧）
    expect(wrapper.find(".message-avatar--self").exists()).toBe(true);

    // 检查气泡样式
    expect(wrapper.find(".message-bubble--from-me").exists()).toBe(true);
  });

  it("renders system message correctly", () => {
    const message = createTestMessage({
      type: "new_member",
      content: { member: { nickname: "New User" }, welcome: "Welcome!" },
    });

    const wrapper = mount(Message, {
      props: {
        message,
        currentUserId: "current-user",
        showTime: true,
      },
    });

    // 检查系统消息布局
    expect(wrapper.find(".message-container--system").exists()).toBe(true);
    expect(wrapper.find(".message-system").exists()).toBe(true);
  });

  it("hides time when showTime is false", () => {
    const message = createTestMessage();
    const wrapper = mount(Message, {
      props: {
        message,
        currentUserId: "current-user",
        showTime: false,
      },
    });

    expect(wrapper.find(".message-time").exists()).toBe(false);
  });

  it("hides avatar when showAvatar is false", () => {
    const message = createTestMessage();
    const wrapper = mount(Message, {
      props: {
        message,
        currentUserId: "current-user",
        showAvatar: false,
      },
    });

    expect(wrapper.find(".message-avatar").exists()).toBe(false);
  });

  it("emits click event when message bubble is clicked", async () => {
    const message = createTestMessage();
    const wrapper = mount(Message, {
      props: {
        message,
        currentUserId: "current-user",
      },
    });

    await wrapper.find(".message-bubble").trigger("click");

    expect(wrapper.emitted("click")).toBeTruthy();
    expect(wrapper.emitted("click")?.[0][0]).toStrictEqual(message);
  });

  it("emits longpress event when message bubble is long pressed", async () => {
    const message = createTestMessage();
    const wrapper = mount(Message, {
      props: {
        message,
        currentUserId: "current-user",
      },
    });

    await wrapper.find(".message-bubble").trigger("longpress");

    expect(wrapper.emitted("longpress")).toBeTruthy();
    expect(wrapper.emitted("longpress")?.[0][0]).toStrictEqual(message);
  });

  it("applies custom avatar size", () => {
    const message = createTestMessage();
    const wrapper = mount(Message, {
      props: {
        message,
        currentUserId: "current-user",
        avatarSize: 48,
        showAvatar: true,
      },
    });

    const avatar = wrapper.find(".message-avatar");
    expect(avatar.attributes("style")).toContain("width: 48px");
    expect(avatar.attributes("style")).toContain("height: 48px");
  });

  it("applies custom max and min width", () => {
    const message = createTestMessage();
    const wrapper = mount(Message, {
      props: {
        message,
        currentUserId: "current-user",
        maxWidth: "80%",
        minWidth: "60%",
      },
    });

    const content = wrapper.find(".message-content");
    expect(content.attributes("style")).toContain("max-width: 80%");
    expect(content.attributes("style")).toContain("min-width: 60%");
  });

  it("renders custom avatar slot", () => {
    const message = createTestMessage();
    const wrapper = mount(Message, {
      props: {
        message,
        currentUserId: "current-user",
        showAvatar: true,
      },
      slots: {
        avatar: '<img src="/custom-avatar.png" alt="Custom Avatar" />',
      },
    });

    expect(wrapper.html()).toContain('src="/custom-avatar.png"');
  });

  it("renders custom content slot", () => {
    const message = createTestMessage();
    const wrapper = mount(Message, {
      props: {
        message,
        currentUserId: "current-user",
      },
      slots: {
        default: '<div class="custom-content">Custom Message Content</div>',
      },
    });

    expect(wrapper.find(".custom-content").exists()).toBe(true);
    expect(wrapper.text()).toContain("Custom Message Content");
  });
});