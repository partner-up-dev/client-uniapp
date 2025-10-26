<script setup lang="ts">
import { computed, ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import * as v from "valibot";
import NavBar from "@/components/common/navBar/navBar.vue";
import { useTranslate } from "@/locale/use";
import PRForm from "@/components/partner_request/PRForm/PRForm.vue";
import { usePartnerRequestStore } from "@/store/partner_request";
import { errorReport, getSafeArea } from "@/utils/vendor";
import { WEIXIN_MESSAGE_SUBSRIPTION_TEMPLATE_IDS } from "@/data/const";
import { PRType, PRStatus } from "@/business/partner_request";
import {
  PartnerRequest,
  PartnerRequestForm,
} from "@/business/partner_request/base";
import { PAGE_PATH } from "@/data/mapper";
import { PAGE_ID } from "@/data/enum";
import SafeAreaInset from "@/components/common/safeAreaInset.vue";
import { EVENT } from "@/data/enum";
import PUNoticeBar from "@/components/common/PUNoticeBar/PUNoticeBar.vue";
import PUButton from "@/components/common/PUButton/PUButton.vue";

const { dt: domain_t } = useTranslate("partner_request.create_end");

// Define props schema with valibot
const propsSchema = v.object({
  cache: v.optional(
    v.pipe(
      v.string(),
      v.transform((value) => value === "true")
    )
  ),
  id: v.optional(
    v.pipe(
      v.string(),
      v.transform((value) => parseInt(value))
    )
  ),
  type: v.optional(v.picklist(Object.values(PRType))),
  immersive: v.optional(
    v.pipe(
      v.string(),
      v.transform((value) => value === "true")
    )
  ),
});

const props = ref<v.InferOutput<typeof propsSchema>>({
  cache: false,
  id: undefined,
  type: PRType.Undefined,
  immersive: false,
});
const navBarRef = ref<InstanceType<typeof NavBar> | null>(null);
const partnerRequestEditorRef = ref<InstanceType<typeof PRForm> | null>(null);
const publishing = ref(false);
const saving = ref(false);
const form_data = ref<PartnerRequestForm>(
  PartnerRequestForm.parse({
    title: null,
    introduction: null,
  })
);
const publishing_notice = ref<string[]>([
  domain_t("publishing_notice.0"),
  domain_t("publishing_notice.1"),
]);

// Use PartnerRequest business layer composable
const partner_request_id = ref<number | undefined>(undefined);
const { pr: partnerRequest, loading: prLoading } = PartnerRequest.usePR(
  partner_request_id.value
);

// methods
/**
 * @name 处理“发布”
 * @description
 * 如果id不存在，则需要创建后再发�?
 *
 * 为了防止修改没有被及时保存，发布前会先保�?
 */
function onPublish(retry: number = 0) {
  partnerRequestEditorRef.value
    ?.validate()
    .then(() => {
      if (props.value.id) {
        PartnerRequest.update(props.value.id, form_data.value)
          .then(() => {
            uni.requestSubscribeMessage({
              tmplIds: [
                WEIXIN_MESSAGE_SUBSRIPTION_TEMPLATE_IDS.new_message,
                WEIXIN_MESSAGE_SUBSRIPTION_TEMPLATE_IDS.partner_application,
              ],
              complete() {
                if (props.value.id) {
                  publishing.value = true;
                  PartnerRequest.publish(props.value.id).finally(() => {
                    publishing.value = false;
                  });
                } else {
                  errorReport(domain_t("publish.invalid_id"));
                }
              },
            });
          })
          .catch(() => {
            errorReport(domain_t("publish.failed_to_save"));
          });
      } else {
        if (retry >= 1) {
          // 防止死循�?
          return;
        }
        create()
          .then(() => {
            onPublish(retry + 1);
          })
          .catch(() => {
            errorReport(domain_t("publish.failed_to_create"));
          });
      }
    })
    .catch(() => {});
}
function create(): Promise<void> {
  return new Promise((resolve, reject) => {
    saving.value = true;

    if (props.value.type === PRType.Undefined) {
      errorReport(domain_t("save.invalid_form_type"));
      reject();
    } else {
      PartnerRequest.create(form_data.value, props.value.type)
        .then((pr) => {
          props.value.id = pr._id;
          resolve();
        })
        .catch(() => {
          reject();
        })
        .finally(() => {
          saving.value = false;
        });
    }
  });
}
/**
 * @name 处理“存稿”
 * @description
 * 如果id存在，则调用编辑接口；如果不存在，则调用创建接口
 *
 */
function onSave() {
  saving.value = true;

  partnerRequestEditorRef.value
    ?.validate()
    .then(() => {
      if (props.value.id) {
        PartnerRequest.update(props.value.id, form_data.value).finally(() => {
          saving.value = false;
        });
      } else {
        create();
      }
    })
    .catch(() => {
      saving.value = false;
    });
}

function onShare() {}

function onView() {
  uni.navigateTo({
    url: `${PAGE_PATH[PAGE_ID.PR_DETAIL]}?id=${props.value.id}`,
  });
}
function onDiscover() {
  // TODO，携带类型筛选器
  uni.navigateTo({
    url: PAGE_PATH[PAGE_ID.EXPLORE],
  });
}

// computed
/**
 * @name 是否已经发布搭子请求
 * @description
 * 有id且对应搭子请求的状态为寻找搭子�?
 */
const isPublished = computed((): boolean => {
  if (props.value.id && partnerRequest.value) {
    partner_request_id.value = props.value.id;
    return partnerRequest.value.status === PRStatus.Joinable;
  }
  return false;
  // return true;  // TEMP
});
/**
 * @name 编辑器高度
 * @description
 * 发布前为屏幕高度-导航栏高�?底部高度
 * 发布后为0
 */
const editorHeight = computed((): number => {
  if (isPublished.value) {
    return 0;
  }
  return (
    uni.getSystemInfoSync().windowHeight -
    (navBarRef?.value?.totalHeight || 76) -
    (36 + 16 + getSafeArea().bottom)
  );
});
/**
 * @name 发布后引导Body高度
 * @description
 * 发布前为0，发布后为屏幕高�?导航栏高�?底部高度-AfPubHead高度-空隙
 */
const afPubBodyHeight = computed((): number => {
  if (!isPublished.value) {
    return 0;
  }
  return (
    uni.getSystemInfoSync().windowHeight -
    (navBarRef?.value?.totalHeight || 76) -
    (36 + 16 + getSafeArea().bottom) -
    160 -
    (24 + 24 + 80)
  );
});

// lifecycle
onLoad(
  (query?: {
    cache?: string;
    id?: string;
    type?: string;
    immersive?: string;
  }) => {
    // must login
    // must_login();

    // parse and validate params with valibot
    props.value = v.parse(propsSchema, query || {});

    // load form data
    if (props.value.immersive) {
      // load from cache(immersive mode: incomplete form)
      const cache = usePartnerRequestStore().draftContent;
      const type = usePartnerRequestStore().draftType;
      if (cache && type) {
        // Initialize empty form and merge with cache
        form_data.value = PartnerRequestForm.parse({
          title: cache.title || null,
          introduction: cache.introduction || null,
        });
        props.value.type = type;
      } else {
        errorReport(domain_t("on_load.load_form_from_cache.failed"));
      }
    } else if (props.value.cache) {
      // load from cache
      const cache = usePartnerRequestStore().draftContent;
      const type = usePartnerRequestStore().draftType;
      if (cache && type) {
        form_data.value = PartnerRequestForm.parse(cache);
        props.value.type = type;
      } else {
        errorReport(domain_t("on_load.load_form_from_cache.failed"));
      }
    } else if (props.value.id) {
      // load from draft
      PartnerRequest.get(props.value.id).then((pr) => {
        // Convert PartnerRequest to PartnerRequestForm
        form_data.value = PartnerRequestForm.parse({
          title: pr.title,
          introduction: pr.introduction,
        });
        // update type
        props.value.type = pr.type;
      });
    } else if (props.value.type) {
      // load from type(empty form)
      form_data.value = PartnerRequestForm.parse({
        title: null,
        introduction: null,
      });
    }
  }
);

onShow(() => {
  uni.$emit(EVENT.ROUTE_EDITOR_PAGE_SHOWED);
});
</script>

<template>
  <view class="page-bg"></view>

  <NavBar
    ref="navBarRef"
    mode="small"
    theme="surface"
    :title="domain_t(`title.${props.type}`)"
  />

  <PUNoticeBar
    class="publishing-notice"
    v-if="publishing"
    :text="publishing_notice"
    prefix="lightbulb"
    background-color="#f6d77d"
    color="#372a04"
    direction="vertical"
    :scrollable="false"
  />

  <view class="af-pub" v-if="isPublished">
    <view class="af-pub__head">
      <view class="flex gap-4 items-center">
        <text class="af-pub__head__icon">🎉</text>
        <text class="af-pub__head__title">{{
          domain_t("after_publish.head.title")
        }}</text>
      </view>
    </view>

    <view class="af-pub__body" :style="{ height: `${afPubBodyHeight}px` }">
      <view class="af-pub__next af-pub__card">
        <view class="title">{{ domain_t("after_publish.next.title") }}</view>
        <view class="description">{{
          domain_t("after_publish.next.description")
        }}</view>
      </view>
      <view class="af-pub__share af-pub__card">
        <view class="title">{{ domain_t("after_publish.share.title") }}</view>
        <view class="description">{{
          domain_t("after_publish.share.description")
        }}</view>
        <PUButton
          class="operation"
          theme="Primary"
          prefix-icon="i-mdi-share"
          :text="domain_t('after_publish.share.operation')"
          @click="onShare"
        />
      </view>
      <view class="af-pub__stop af-pub__card">
        <view class="title">{{ domain_t("after_publish.stop.title") }}</view>
        <view class="description">{{
          domain_t("after_publish.stop.description")
        }}</view>
      </view>
    </view>
  </view>

  <view
    class="editor-cont"
    :style="{ height: `${editorHeight}px` }"
    v-if="!isPublished"
  >
    <PRForm ref="partnerRequestEditorRef" :base-form="form_data" />
  </view>

  <view class="footer">
    <view class="operations">
      <!-- Not Published -->

      <PUButton
        class="operations__save button"
        v-if="!isPublished"
        theme="SurfaceOutlined"
        prefix-icon="i-mdi-content-save"
        :text="domain_t('operations.save')"
        :loading="publishing || saving"
        @click="onSave"
      />

      <PUButton
        class="operations__publish button"
        v-if="!isPublished"
        theme="Primary"
        prefix-icon="i-mdi-check"
        :text="domain_t('operations.publish')"
        :loading="publishing || saving"
        @click="onPublish"
      />

      <!-- Published -->

      <PUButton
        class="operations__view button"
        v-if="isPublished"
        theme="SurfaceOutlined"
        prefix-icon="i-mdi-eye"
        :text="domain_t('operations.view')"
        @click="onView"
      />

      <PUButton
        class="operations__discover button"
        v-if="isPublished"
        theme="Primary"
        prefix-icon="i-mdi-compass"
        :text="domain_t('operations.discover')"
        @click="onDiscover"
      />
    </view>

    <SafeAreaInset position="bottom" />
  </view>
</template>

<style lang="scss" scoped src="./create_end.scss"></style>
