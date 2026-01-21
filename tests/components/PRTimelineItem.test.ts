import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PRTimelineItem from '@/components/partner_request/PRTimelineItem/PRTimelineItem.vue';
import { PRStatus } from '@/business/partner_request';

// Mock the useTranslate composable
vi.mock('@/locale', () => ({
  useTranslate: () => ({
    dt: vi.fn((key: string, fallback: string) => {
      // Mock translations based on key
      const translations: Record<string, string> = {
        'draft.title': '草稿',
        'draft.description': '搭子请求处于草稿状态，需要完善信息后发布',
        'joinable.title': '可加入',
        'joinable.description': '搭子请求已发布，可加入',
        'ready.title': '已就绪',
        'ready.description': '搭子请求已就绪，等待执行',
        'performing.title': '执行中',
        'performing.description': '搭子请求正在执行中',
        'settling.title': '结算中',
        'settling.description': '搭子请求正在结算中',
        'closed.title': '已关闭',
        'closed.description': '搭子请求已完成并关闭',
        'cancelled.title': '已取消',
        'cancelled.description': '搭子请求已被取消',
        'merged.title': '已合并',
        'merged.description': '搭子请求已与其他请求合并',
      };
      return translations[key] || fallback;
    }),
  }),
}));

describe('PRTimelineItem', () => {
  const defaultProps = {
    type: PRStatus.Draft,
    state: 'future' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Props rendering', () => {
    it('renders title and description based on type', () => {
      const wrapper = mount(PRTimelineItem, {
        props: { ...defaultProps, type: PRStatus.Draft, expand: true },
      });

      expect(wrapper.text()).toContain('草稿');
      expect(wrapper.text()).toContain('搭子请求处于草稿状态，需要完善信息后发布');
    });

    it('applies correct CSS classes based on state', () => {
      const wrapper = mount(PRTimelineItem, {
        props: { ...defaultProps, state: 'current' },
      });

      expect(wrapper.classes()).toContain('pr-timeline-item--current');
    });

    it('does not apply current border for terminal states when state is current', () => {
      const terminalStates = [PRStatus.Cancelled, PRStatus.Merged, PRStatus.Closed];

      terminalStates.forEach((status) => {
        const wrapper = mount(PRTimelineItem, {
          props: { ...defaultProps, type: status, state: 'current' },
        });

        expect(wrapper.classes()).not.toContain('pr-timeline-item--current');
      });
    });
  });

  describe('Model: expand', () => {
    it('defaults expand to false', () => {
      const wrapper = mount(PRTimelineItem, {
        props: defaultProps,
      });

      expect(wrapper.vm.expand).toBe(false);
    });

    it('sets expand to true when state is current', () => {
      const wrapper = mount(PRTimelineItem, {
        props: { ...defaultProps, state: 'current' },
      });

      expect(wrapper.vm.expand).toBe(true);
    });
  });

  describe('Emits', () => {
    it('emits update:expand when expand changes', async () => {
      const wrapper = mount(PRTimelineItem, {
        props: defaultProps,
      });

      await wrapper.trigger('click');
      expect(wrapper.emitted('update:expand')).toBeTruthy();
      expect(wrapper.emitted('update:expand')![0]).toEqual([true]);
    });
  });
});
