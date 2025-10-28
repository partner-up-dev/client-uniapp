<script setup lang="ts">
import { computed, ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import * as v from "valibot";
import ScaffoldLayout from "@/components/common/layout/scaffoldLayout.vue";
import NavBar from "@/components/common/navBar/navBar.vue";
import { useTranslate } from "@/locale/use";
import PRForm from "@/components/partner_request/PRForm/PRForm.vue";
import { usePartnerRequestStore } from "@/store/partner_request";
import { errorReport } from "@/utils/vendor";
import { WEIXIN_MESSAGE_SUBSRIPTION_TEMPLATE_IDS } from "@/data/const";
import { PRType, PRStatus } from "@/business/partner_request";
import {
  PartnerRequest,
  PartnerRequestForm,
} from "@/business/partner_request/base";
import { CommutePRForm } from "@/business/partner_request/commute";
import { RideHailingPRForm } from "@/business/partner_request/ride_hailing";
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
  type: v.optional(v.enum(PRType)),
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
const PRFormRef = ref<InstanceType<typeof PRForm> | null>(null);
const publishing = ref(false);
const saving = ref(false);
const form = ref({});
const publishing_notice = ref<string[]>([
  domain_t("publishing_notice.0"),
  domain_t("publishing_notice.1"),
]);

// Use PartnerRequest business layer composable
const prId = ref<number | undefined>(undefined);
const { pr: partnerRequest, loading: prLoading } = PartnerRequest.use(prId.value);

// Helper function to get form class by PR type
function getFormClassByType(type: PRType) {
  switch (type) {
    case PRType.Commute:
      return CommutePRForm;
    case PRType.RideHailing:
      return RideHailingPRForm;
    default:
      return PartnerRequestForm;
  }
}

// methods
/**
 * @name 处理"发布"
 * @description
 * 如果id不存在，则需要创建后再发布
 *
 * 为了防止修改没有被及时保存，发布前会先保存
 */
function onPublish(retry: number = 0) {
  PRFormRef.value
    ?.validate()
    .then(() => {
      if (props.value.id) {
        PartnerRequest.update(props.value.id, form.value)
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
          // 防止死循环
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
      PartnerRequest.create(form.value, props.value.type)
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
 * @name 处理"存稿"
 * @description
 * 如果id存在，则调用编辑接口；如果不存在，则调用创建接口
 */
function onSave() {
  saving.value = true;

  PRFormRef.value?.validate().then((result) => {
    if (result.success) {
      if (props.value.id) {
        // FIXME
        PartnerRequest.update(props.value.id, form.value).finally(() => {
          saving.value = false;
        });
      } else {
        create();
      }
    } else {
      saving.value = false;
    }
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
 * 有id且对应搭子请求的状态为寻找搭子中
 */
const isPublished = computed((): boolean => {
  if (props.value.id && partnerRequest.value) {
    prId.value = props.value.id;
    return partnerRequest.value.status === PRStatus.Joinable;
  }
  return false;
  // return true;  // TEMP
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
        const FormClass = getFormClassByType(type);
        form.value = FormClass.parse({
          title: cache.title || null,
          introduction: cache.introduction || null,
        }) as any;
        props.value.type = type;
      } else {
        errorReport(domain_t("on_load.load_form_from_cache.failed"));
      }
    } else if (props.value.cache) {
      // load from cache
      const cache = usePartnerRequestStore().draftContent;
      const type = usePartnerRequestStore().draftType;
      if (cache && type) {
        const FormClass = getFormClassByType(type);
        form.value = FormClass.parse(cache) as any;
        props.value.type = type;
      } else {
        errorReport(domain_t("on_load.load_form_from_cache.failed"));
      }
    } else if (props.value.id) {
      // load from draft
      PartnerRequest.get(props.value.id).then((pr) => {
        // Convert PartnerRequest to appropriate form type
        const FormClass = getFormClassByType(pr.type);
        form.value = FormClass.parse({
          title: pr.title,
          introduction: pr.introduction,
        }) as any;
        // update type
        props.value.type = pr.type;
      });
    } else if (props.value.type) {
      // load from type(empty form)
      // PRForm will handle creating the form instance via its watcher
    }
  }
);

onShow(() => {
  uni.$emit(EVENT.ROUTE_EDITOR_PAGE_SHOWED);
});
</script>

<template>
  <view class="page-bg"></view>

  <ScaffoldLayout>
    <!-- Header Slot -->
    <template #header>
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
    </template>

    <!-- Content Slot -->
    <view class="content-wrapper">
      <!-- After Published View -->
      <view class="af-pub" v-if="isPublished">
        <view class="af-pub__head">
          <view class="flex gap-4 items-center">
            <text class="af-pub__head__icon">🎉</text>
            <text class="af-pub__head__title">{{
              domain_t("after_publish.head.title")
            }}</text>
          </view>
        </view>

        <view class="af-pub__body">
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

      <!-- Editor View -->
      <view class="editor-cont" v-if="!isPublished">
        <PRForm ref="PRFormRef" v-model="form" :type="props.type" />
      </view>
    </view>

    <!-- Footer Slot -->
    <template #footer>
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
  </ScaffoldLayout>
</template>

<style lang="scss" scoped src="./create_end.scss"></style>
