import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { ref, computed } from 'vue';
import * as v from 'valibot';
import SubApplication from '@/components/partner_request/SubApplication/SubApplication.vue';
import { PartnerSubApplication } from '@/business/partner_request/application';
import { PartnerRole } from '@/business/partner_request/partner';

// Mock the locale composable
vi.mock('@/locale/use', () => ({
  useTranslate: () => ({
    dt: (key: string) => key,
  }),
}));

// Mock the PartnerRole.use composable
vi.mock('@/business/partner_request/partner', () => ({
  PartnerRole: {
    use: vi.fn((roleId?: number) => ({
      partnerRole: computed(() => roleId ? {
        id: roleId,
        name: '测试角色',
        rule: '这是测试角色的规则描述',
      } : undefined),
      roleId: ref(roleId),
      loading: ref(false),
      bindId: vi.fn(),
    })),
  },
  PartnerRoleRefV: v.number()
}));

// Mock child components
vi.mock('@/components/common/PUTextarea/PUTextarea.vue', () => ({
  default: {
    name: 'PUTextarea',
    template: '<view class="mock-textarea"><slot /></view>',
    props: ['modelValue', 'placeholder', 'height', 'focusHeight'],
  },
}));

vi.mock('@/components/common/PUButton/PUButton.vue', () => ({
  default: {
    name: 'PUButton',
    template: '<button class="mock-button" :class="[prefixIcon]"><slot /></button>',
    props: ['theme', 'type', 'size', 'prefixIcon'],
  },
}));

vi.mock('@/components/common/PUDrawer/PUDrawer.vue', () => ({
  default: {
    name: 'PUDrawer',
    template: '<view v-if="visible" class="mock-drawer"><view class="drawer-title">{{ title }}</view><slot /></view>',
    props: ['visible', 'title'],
  },
}));

describe('SubApplication', () => {
  let wrapper: VueWrapper<any>;
  let mockSubApplication: PartnerSubApplication;

  beforeEach(() => {
    // 创建测试用的 SubApplication 实例
    mockSubApplication = new PartnerSubApplication({
      role: 1,
      rationale: '我有丰富的经验',
    });
  });

  describe('Base', () => {
    it('exist', () => {
      wrapper = mount(SubApplication, {
        props: {
          subApplication: mockSubApplication,
          editable: true,
        },
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('show role.id', () => {
      wrapper = mount(SubApplication, {
        props: {
          subApplication: mockSubApplication,
          editable: true,
        },
      });

      const idText = wrapper.find('.id-text');
      expect(idText.exists()).toBe(true);
      expect(idText.text()).toBe('#1');
    });

    it('show role.name', () => {
      wrapper = mount(SubApplication, {
        props: {
          subApplication: mockSubApplication,
          editable: true,
        },
      });

      const roleName = wrapper.find('.role-name');
      expect(roleName.exists()).toBe(true);
      expect(roleName.text()).toBe('测试角色');
    });
  });

  describe('editable', () => {
    beforeEach(() => {
      wrapper = mount(SubApplication, {
        props: {
          subApplication: mockSubApplication,
          editable: true,
        },
      });
    });

    it('show role.rule', () => {
      const rule = wrapper.find('.rule');
      expect(rule.exists()).toBe(true);
      expect(rule.text()).toBe('这是测试角色的规则描述');
    });

    it('应该显示删除按钮', () => {
      const deleteButton = wrapper.findAll('.mock-button').find(btn =>
        btn.attributes('prefix-icon') === 'i-mdi-delete-outline'
      );
      expect(deleteButton).toBeDefined();
    });

    it('应该不显示展开按钮', () => {
      const expandButton = wrapper.findAll('.mock-button').find(btn =>
        btn.attributes('prefix-icon') === 'i-mdi-chevron-right'
      );
      expect(expandButton).toBeUndefined();
    });

    it('应该显示申请理由编辑器', () => {
      const textarea = wrapper.findComponent({ name: 'PUTextarea' });
      expect(textarea.exists()).toBe(true);
    });

    it('点击删除按钮应该触发 delete 事件', async () => {
      const deleteButton = wrapper.findAll('.mock-button').find(btn =>
        btn.attributes('prefix-icon') === 'i-mdi-delete-outline'
      );

      await deleteButton?.trigger('click');

      expect(wrapper.emitted('delete')).toBeTruthy();
      expect(wrapper.emitted('delete')?.[0]).toEqual([mockSubApplication]);
    });
  });

  describe('not editable', () => {
    beforeEach(() => {
      wrapper = mount(SubApplication, {
        props: {
          subApplication: mockSubApplication,
          editable: false,
        },
      });
    });

    it('应该不显示角色规则', () => {
      const rule = wrapper.find('.rule');
      expect(rule.exists()).toBe(false);
    });

    it('应该不显示删除按钮', () => {
      const deleteButton = wrapper.findAll('.mock-button').find(btn =>
        btn.attributes('prefix-icon') === 'i-mdi-delete-outline'
      );
      expect(deleteButton).toBeUndefined();
    });

    it('应该显示展开按钮', () => {
      const expandButton = wrapper.findAll('.mock-button').find(btn =>
        btn.attributes('prefix-icon') === 'i-mdi-chevron-right'
      );
      expect(expandButton).toBeDefined();
    });

    it('应该不显示申请理由编辑器', () => {
      const textarea = wrapper.findComponent({ name: 'PUTextarea' });
      expect(textarea.exists()).toBe(false);
    });

    it('点击展开按钮应该显示抽屉', async () => {
      const expandButton = wrapper.findAll('.mock-button').find(btn =>
        btn.attributes('prefix-icon') === 'i-mdi-chevron-right'
      );

      expect(wrapper.find('.mock-drawer').exists()).toBe(false);

      await expandButton?.trigger('click');
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.mock-drawer').exists()).toBe(true);
    });

    it('抽屉应该显示角色名称作为标题', async () => {
      const expandButton = wrapper.findAll('.mock-button').find(btn =>
        btn.attributes('prefix-icon') === 'i-mdi-chevron-right'
      );

      await expandButton?.trigger('click');
      await wrapper.vm.$nextTick();

      const drawerTitle = wrapper.find('.drawer-title');
      expect(drawerTitle.text()).toBe('测试角色');
    });

    it('抽屉应该显示角色规则和申请理由', async () => {
      const expandButton = wrapper.findAll('.mock-button').find(btn =>
        btn.attributes('prefix-icon') === 'i-mdi-chevron-right'
      );

      await expandButton?.trigger('click');
      await wrapper.vm.$nextTick();

      const drawerContent = wrapper.find('.drawer-content');
      expect(drawerContent.exists()).toBe(true);

      const rule = drawerContent.find('.rule');
      expect(rule.text()).toBe('这是测试角色的规则描述');

      const rationale = drawerContent.find('.rationale-text');
      expect(rationale.exists()).toBe(true);
    });
  });

  describe('申请理由处理', () => {
    it('应该显示用户填写的申请理由', () => {
      wrapper = mount(SubApplication, {
        props: {
          subApplication: mockSubApplication,
          editable: true,
        },
      });

      const textarea = wrapper.findComponent({ name: 'PUTextarea' });
      expect(textarea.props('modelValue')).toBe('我有丰富的经验');
    });

    it('当申请理由为空时应该显示空字符串', () => {
      const emptySubApplication = new PartnerSubApplication({
        role: 1,
        rationale: null,
      });

      wrapper = mount(SubApplication, {
        props: {
          subApplication: emptySubApplication,
          editable: true,
        },
      });

      const textarea = wrapper.findComponent({ name: 'PUTextarea' });
      expect(textarea.props('modelValue')).toBe('');
    });

    it('只读模式下应该在抽屉中显示申请理由', async () => {
      wrapper = mount(SubApplication, {
        props: {
          subApplication: mockSubApplication,
          editable: false,
        },
      });

      const expandButton = wrapper.findAll('.mock-button').find(btn =>
        btn.attributes('prefix-icon') === 'i-mdi-chevron-right'
      );

      await expandButton?.trigger('click');
      await wrapper.vm.$nextTick();

      const rationaleText = wrapper.find('.rationale-text');
      expect(rationaleText.text()).toBe('我有丰富的经验');
    });

    it('只读模式下理由为空时应该显示提示文本', async () => {
      const emptySubApplication = new PartnerSubApplication({
        role: 1,
        rationale: null,
      });

      wrapper = mount(SubApplication, {
        props: {
          subApplication: emptySubApplication,
          editable: false,
        },
      });

      const expandButton = wrapper.findAll('.mock-button').find(btn =>
        btn.attributes('prefix-icon') === 'i-mdi-chevron-right'
      );

      await expandButton?.trigger('click');
      await wrapper.vm.$nextTick();

      const rationaleText = wrapper.find('.rationale-text');
      expect(rationaleText.text()).toBe('你没有填写');
    });
  });

  describe('角色信息处理', () => {
    it('当角色未加载时应该显示默认角色名称', () => {
      vi.mocked(PartnerRole.use).mockReturnValueOnce({
        partnerRole: computed(() => undefined),
        roleId: ref(undefined),
        loading: ref(true),
        bindId: vi.fn(),
      });

      wrapper = mount(SubApplication, {
        props: {
          subApplication: mockSubApplication,
          editable: true,
        },
      });

      const roleName = wrapper.find('.role-name');
      expect(roleName.text()).toBe('角色名称');
    });

    it('当角色规则未加载时应该显示默认规则', () => {
      vi.mocked(PartnerRole.use).mockReturnValueOnce({
        partnerRole: computed(() => undefined),
        roleId: ref(undefined),
        loading: ref(true),
        bindId: vi.fn(),
      });

      wrapper = mount(SubApplication, {
        props: {
          subApplication: mockSubApplication,
          editable: true,
        },
      });

      const rule = wrapper.find('.rule');
      expect(rule.text()).toBe('角色的权利与义务明细');
    });
  });

  describe('event', () => {
    it('delete', async () => {
      wrapper = mount(SubApplication, {
        props: {
          subApplication: mockSubApplication,
          editable: true,
        },
      });

      const deleteButton = wrapper.find('.mock-button');

      await deleteButton.trigger('click');

      const deleteEvents = wrapper.emitted('delete');
      expect(deleteEvents).toHaveLength(1);
      expect(deleteEvents?.[0][0]).toStrictEqual(mockSubApplication);
    });
  });

  describe('visual', async () => {
    it('editable', async () => {
      await expect(page)
    })
  })
});