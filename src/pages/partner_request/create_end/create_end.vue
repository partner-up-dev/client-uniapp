<script setup lang="ts">
import { computed, ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import * as v from "valibot";
import ScaffoldLayout from "@/components/common/layout/scaffoldLayout.vue";
import NavBar from "@/components/common/navBar/navBar.vue";
import { useTranslate } from "@/locale/use";
import PRForm from "@/components/partner_request/PRForm/PRForm.vue";
import { usePartnerRequestStore } from "@/store/partner_request";
import { errorReport, navigate } from "@/utils/vendor";
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
  type: PRType.Undefined,
  immersive: false,
});
const navBarRef = ref<InstanceType<typeof NavBar> | null>(null);
const PRFormRef = ref();
const form = ref<PartnerRequestForm>({} as unknown as PartnerRequestForm);
const publishing = computed((): boolean => {
  return PRFormRef.value ? PRFormRef.value.publishing : false;
});
const saving = ref(false);
const publishing_notice = ref<string[]>([
  domain_t("publishing_notice.0"),
  domain_t("publishing_notice.1"),
]);

// Use PartnerRequest business layer composable
const { pr: partnerRequest, bindPRId } = PartnerRequest.use();
bindPRId(() => form.value._id);

// methods
function onPublish() {
  PRFormRef.value!.publish();
}

function onSave() {
  PRFormRef.value!.save().finally(() => {
    saving.value = false;
  });
  saving.value = true;
}

function onShare() {}

function onView() {
  navigate({
    page_id: PAGE_ID.PR_DETAIL,
    params: { id: String(form.value._id) },
  });
}

function onDiscover() {
  // TODO，携带类型筛选器
  navigate({
    page_id: PAGE_ID.EXPLORE,
  });
}

// computed
const isPublished = computed((): boolean => {
  if (partnerRequest.value) {
    return partnerRequest.value.status === PRStatus.Joinable;
  }
  return false;
  // return true; // TEMP
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
        form.value = PartnerRequestForm.parse({
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
        form.value = PartnerRequestForm.parse(cache);
        props.value.type = type;
      } else {
        errorReport(domain_t("on_load.load_form_from_cache.failed"));
      }
    } else if (form.value._id) {
      // load from draft
      PartnerRequest.get(form.value._id).then((pr) => {
        // Convert PartnerRequest to PartnerRequestForm
        form.value = PartnerRequestForm.parse({
          title: pr.title,
          introduction: pr.introduction,
        });
        // update type
        props.value.type = pr.type;
      });
    } else if (props.value.type) {
      // load from type(empty form)
      form.value = PartnerRequestForm.parse({
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
        <PRForm ref="PRFormRef" v-model="form" :type="props.type!" />
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
            :loading="saving"
            :disabled="publishing"
            @click="onSave"
          />

          <PUButton
            class="operations__publish button"
            v-if="!isPublished"
            theme="Primary"
            prefix-icon="i-mdi-check"
            :text="domain_t('operations.publish')"
            :loading="publishing || saving"
            :disabled="publishing"
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
