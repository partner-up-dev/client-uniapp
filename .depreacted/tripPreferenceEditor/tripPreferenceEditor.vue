<script lang="ts">
/**
 * @name 出行偏好编辑�?
 * @docs https://git.hadream.ltd/anana/application/uniapp/-/wikis/PartnerRequest/Trip/Components/PreferenceEditor
 * @issues 
 * - anana/application/uniapp#213
 */
export default {
    name: "TripPreferenceEditor",
    options: BasicComponentOptions,
}
</script>
<script setup lang="ts">
import { BasicComponentOptions } from '@/utils/vue';
import { TripPreferenceEditorEmits, TripPreferenceEditorProps, TripPreferenceRules, domain_t, t } from './types';
import { ref, watchEffect } from 'vue';
import type { FormInstance } from 'wot-design-uni/components/wd-form/types';
import TripPurposePicker from '@/components/base/tripPurposePicker/tripPurposePicker.vue';
import RfTripSupInfoEditor from '../rfTripSupInfoEditor/rfTripSupInfoEditor.vue';

const props = defineProps(TripPreferenceEditorProps);
const emit = defineEmits(TripPreferenceEditorEmits);

// data
const error_msg = ref<string>('');
const formRef = ref<null | FormInstance>(null);
const trip_purpose_picker_popup = ref<boolean>(false);
/** 行李数量（个�?*/
const luggage_number = ref<number>();

// methods
function validate(): Promise<{valid: boolean}> {
    return new Promise<{valid: boolean}>((resolve, reject) => {
        formRef.value?.validate().then(({valid, errors}) => {
            if (!valid) {
                error_msg.value = errors[0].message;
                resolve({valid: false});
            }
            else {
                error_msg.value = '';
                resolve({valid: true});
            }
        }).catch(() => {
            reject();
        });
    })
}

// watch
/**
 * @name 行李数量转升
 * @description
 * 用户输入的是行李数量，但实际要记录升，按�?0L/个计算；
 * 使用watchEffect实现
 */
watchEffect(() => {
    if (luggage_number.value) {
        props.modelValue.luggage = luggage_number.value * 20;
    }
    else {
        props.modelValue.luggage = 0;
    }
})

// expose
defineExpose({
    validate
})


</script>

<template>
    
    <wd-form
        ref="formRef"
        :model="modelValue" :rules="TripPreferenceRules"
    >
        <wd-cell :custom-style="{padding: '0px'}"
            prop="purpose" 
            :title="domain_t('purpose.title')"
            :value="modelValue.purpose ? t(`base.trip_purpose_picker.purpose_text.${modelValue.purpose}`) : domain_t('purpose.placeholder')"
            is-link
            @click="trip_purpose_picker_popup = true"
        ></wd-cell>
        
        <wd-cell custom-class="luggage"
            :custom-style="{padding: '0px'}"
            prop="luggage"
        >
            <template #title>
                <view class="luggage__title">
                    <!-- <wd-icon classPrefix="trip-icon" name="suitcase" custom-class="luggage__icon"></wd-icon> -->
                    <view>{{ domain_t('luggage.prefix') }}</view>
                </view>
            </template>

            <view class="luggage__value">
                <wd-input custom-class="luggage__input"
                    no-border inputmode="numeric"
                    :placeholder="domain_t('luggage.placeholder')"
                    v-model="luggage_number"
                ></wd-input>
                <view>{{ domain_t('luggage.unit') }}</view>
            </view>
        </wd-cell>

        <RfTripSupInfoEditor 
            :route="route" :transportation="transportation"
            :trip-purpose="modelValue.purpose ?? undefined"
        />

    </wd-form>

    <view class="error-msg">
        {{ error_msg }}
    </view>

    <wd-popup custom-class="popup"
        v-model="trip_purpose_picker_popup"
        close-on-click-modal
        position="bottom" safe-area-inset-bottom
    >
        <TripPurposePicker class="tp-picker"
            v-model="modelValue.purpose"
            blend-to-background="right"
            @select="emit('change', 'purpose');trip_purpose_picker_popup = false"
        />
    </wd-popup>

</template>

<style lang="scss" scoped>
@use "./index.scss";
</style>

<style lang="scss">
@use '@/static/style/_color.scss';
@use '@/static/style/_shape.scss';

:deep(.popup) {
    background: $-sys-color-surface !important;

    overflow-x: hidden;

    @include pu-radius-top-medium;
}
</style>
