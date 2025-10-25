<template>
  <view :class="buttonClasses" @click="onClick">
    <!-- Prefix Icon -->
    <view v-if="prefixIcon" class="prefix-icon icon-wrapper">
      <text :class="prefixIcon" class="icon"></text>
      <!-- <text class="i-mdi-bookmark-sharp icon"></text> -->
    </view>

    <!-- Text Content -->
    <view v-if="type !== 'OnlyIcon' && text" class="text font-label-large">
      <text>{{ text }}</text>
    </view>

    <!-- Suffix Icon -->
    <view v-if="suffixIcon" class="suffix-icon icon-wrapper">
      <text :class="suffixIcon" class="icon"></text>
    </view>

    <!-- Dot indicator -->
    <view v-if="showDot" class="dot" />
  </view>
</template>

<script lang="ts">
export default {
  name: "PUButton",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { kebabCase } from "@/utils";
import { BasicComponentOptions } from "@/utils/vue";

interface Props {
  // Button content
  text?: string;
  prefixIcon?: string;
  suffixIcon?: string;

  // Display controls
  showDot?: boolean;

  // State controls
  toggled?: boolean;
  active?: boolean;

  // Button variants
  theme?:
    | "Primary"
    | "PrimaryContainer"
    | "Tertiary"
    | "Surface"
    | "SurfaceOutlined"
    | "Plain";
  type?: "WithText" | "OnlyIcon" | "Bar";
  size?: "xSmall" | "Small" | "Medium" | "Large";
  rounded?: boolean;

  // Interaction
  disabled?: boolean;
  loading?: boolean;

  // Custom styling
  customStyle?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  text: "Button",
  showDot: false,
  toggled: false,
  active: false,
  theme: "PrimaryContainer",
  type: "WithText",
  size: "Small",
  rounded: false,
  disabled: false,
  loading: false,
});

const emit = defineEmits<{
  click: [event: any];
}>();

const buttonClasses = computed(() => {
  const classes = ["pu-button"];

  // Theme classes
  classes.push(kebabCase(props.theme));

  // Type classes
  classes.push(kebabCase(props.type));
  classes.push(kebabCase(props.type) + "--" + kebabCase(props.size));

  // Size classes
  classes.push(kebabCase(props.size));

  // Shape classes
  if (props.rounded) classes.push("rounded");

  // State classes
  if (props.disabled) classes.push("disabled");
  if (props.loading) classes.push("loading");
  if (props.active) classes.push("active");
  if (props.toggled) classes.push("toggled");

  return classes;
});

const onClick = (event: any) => {
  if (!props.disabled && !props.loading) {
    emit("click", event);
  }
};
</script>

<style scoped lang="scss" src="./PUButton.scss"></style>
