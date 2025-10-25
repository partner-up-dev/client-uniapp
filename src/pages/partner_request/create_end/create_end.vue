<script setup lang="ts">
import { computed, ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import * as v from "valibot";
import NavBar from "@/components/common/navBar/navBar.vue";
import { useTranslate } from "@/locale/use";
import PartnerRequestEditor from "../../components/partnerRequestEditor/partnerRequestEditor.vue";
import {
  usePartnerRequest,
  // usePartnerRequestStore,
} from "@/store/partner_request";
import { errorReport, getSafeArea } from "@/utils/vendor";
import { WEIXIN_MESSAGE_SUBSRIPTION_TEMPLATE_IDS } from "@/data/const";
import {
  get_partner_request_editor_form,
  get_partner_request_editor_form_from_partner_request,
  type PartnerRequestEditableContentUnion,
} from "@/data/form";
import { PRType } from "@/business/partner_request";
import { PartnerRequest } from "@/business/partner_request/base";
import { PAGE_PATH } from "@/data/mapper";
import { PAGE_ID } from "@/data/enum";
import SafeAreaInset from "@/components/common/safeAreaInset.vue";
import { EVENT } from "@/data/enum";

const { dt: domain_t } = useTranslate("partner_request.create_end");
const { partner_request_id, isWaitingForPartners } = usePartnerRequest();

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
const partnerRequestEditorRef = ref<InstanceType<
  typeof PartnerRequestEditor
> | null>(null);
const publishing = ref(false);
const saving = ref(false);
const form_data = ref<PartnerRequestEditableContentUnion<PRType>>(
  get_partner_request_editor_form(props.value.type)
);
const publishing_notice = ref<string[]>([
  domain_t("publishing_notice.0"),
  domain_t("publishing_notice.1"),
]);

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
        // TODO: Implement edit API
        PartnerRequest.api
          .requestHTTP({
            method: "PUT",
            endpoint: `/${props.value.id}`,
            data: form_data.value,
            operation_id: "PartnerRequestV2Edit",
          })
          .then(() => {
            uni.requestSubscribeMessage({
              tmplIds: [
                WEIXIN_MESSAGE_SUBSRIPTION_TEMPLATE_IDS.new_message,
                WEIXIN_MESSAGE_SUBSRIPTION_TEMPLATE_IDS.partner_application,
              ],
              complete() {
                if (props.value.id) {
                  publishing.value = true;
                  // TODO: Implement publish API
                  PartnerRequest.api
                    .requestHTTP({
                      method: "POST",
                      endpoint: `/${props.value.id}/publish`,
                      operation_id: "PartnerRequestV2Publish",
                    })
                    .finally(() => {
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
      // TODO: Implement create API
      PartnerRequest.api
        .requestHTTP({
          method: "POST",
          endpoint: "/",
          data: { ...form_data.value, type: props.value.type },
          operation_id: "PartnerRequestV2Create",
        })
        .then(({ body }) => {
          const pr = body.parsed;
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
        PartnerRequest.api
          .requestHTTP({
            method: "PUT",
            endpoint: `/${props.value.id}`,
            data: form_data.value,
            operation_id: "PartnerRequestV2Edit",
          })
          .finally(() => {
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
  if (props.value.id) {
    partner_request_id.value = props.value.id;
    return isWaitingForPartners.value;
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
        form_data.value = get_partner_request_editor_form(type);
        // replace fields that cache defined to form_data
        Object.entries(cache).forEach(([key, value]) => {
          if (key in form_data.value && value !== undefined) {
            // @ts-ignore
            form_data.value[key] = value;
          }
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
        form_data.value = cache;
        props.value.type = type;
      } else {
        errorReport(domain_t("on_load.load_form_from_cache.failed"));
      }
    } else if (props.value.id) {
      // load from draft
      PartnerRequest.get(props.value.id).then((pr) => {
        // update form_data
        form_data.value = get_partner_request_editor_form_from_partner_request(
          pr as any
        );
        // update type
        props.value.type = pr.type;
      });
    } else if (props.value.type) {
      // load from type(empty form)
      form_data.value = get_partner_request_editor_form(props.value.type);
    }
  }
);

onShow(() => {
  uni.$emit(EVENT.ROUTE_EDITOR_PAGE_SHOWED);
});
</script>

<template>
  <view class="bg"></view>

  <NavBar ref="navBarRef" mode="small" :title="domain_t(`title.${props.type}`)" />

  <wd-notice-bar
    class="publishing-notice"
    v-if="publishing"
    :text="publishing_notice"
    prefix="tips"
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
        <wd-button class="operation" type="primary" icon="share" @click="onShare">
          {{ domain_t("after_publish.share.operation") }}
        </wd-button>
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
    <PartnerRequestEditor
      ref="partnerRequestEditorRef"
      :modelValue="form_data"
      :type="props.type"
    />
  </view>

  <view class="footer">
    <view class="operations">
      <!-- Not Published -->

      <wd-button
        class="operations__save button"
        v-if="!isPublished"
        type="info"
        plain
        icon="save"
        :loading="publishing || saving"
        loading-color="#1a1c16"
        @click="onSave"
      >
        {{ domain_t("operations.save") }}
      </wd-button>

      <wd-button
        class="operations__publish button"
        v-if="!isPublished"
        type="primary"
        icon="check"
        :loading="publishing || saving"
        loading-color="#96d945"
        @click="onPublish"
      >
        {{ domain_t("operations.publish") }}
      </wd-button>

      <!-- Published -->

      <wd-button
        class="operations__view button"
        v-if="isPublished"
        type="info"
        plain
        icon="view"
        @click="onView"
      >
        {{ domain_t("operations.view") }}
      </wd-button>

      <wd-button
        class="operations__discover button"
        v-if="isPublished"
        type="success"
        icon="discover"
        classPrefix="partnerup-iconfont"
        @click="onDiscover"
      >
        {{ domain_t("operations.discover") }}
      </wd-button>
    </view>

    <SafeAreaBottomInset />
  </view>
</template>

<style lang="scss" scoped src="./create_end.scss"></style>
