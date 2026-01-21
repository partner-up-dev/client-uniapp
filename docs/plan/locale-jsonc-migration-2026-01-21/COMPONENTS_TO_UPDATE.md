# Components/pages to update (useTranslate → localMessages)

## What to do for each file

1. Create local JSONC files next to the component/page:
   - compName.zh-Hans.jsonc
   - compName.en-US.jsonc

2. Create/update compName.ts (or pageName.ts) next to the Vue file to export:
   - `export const localMessages = { "zh-Hans": zhHans, "en-US": enUs } as const;`

3. In the .vue file:
   - Replace `useTranslate` import with `useI18n` from vue-i18n.
   - Import `localMessages` from the adjacent compName/pageName module.
   - Replace `const { dt } = useTranslate("...")` with:
     - `const { t: lt } = useI18n({ inheritLocale: true, messages: localMessages });`
   - Replace all `dt(...)` with `lt(...)`.
   - If the old code called `t(...)` from `useTranslate`, replace with `lt(...)` and ensure keys are local or explicitly prefixed.

4. If the file uses dynamic keys (e.g., `t(
  base.xxx
)`), keep those keys in global JSONC and call `lt` with the full key.

## Pages to update

- [src/pages/partner_request/detail/detail.vue](src/pages/partner_request/detail/detail.vue)
- [src/pages/partner_request/create_trip/create_trip.vue](src/pages/partner_request/create_trip/create_trip.vue)
- [src/pages/partner_request/create_start/create_start.vue](src/pages/partner_request/create_start/create_start.vue)
- [src/pages/partner_request/create_end/create_end.vue](src/pages/partner_request/create_end/create_end.vue)
- [src/pages/me/me.vue](src/pages/me/me.vue)
- [src/pages/home/home.vue](src/pages/home/home.vue)
- [src/pages/account/profile/profile.vue](src/pages/account/profile/profile.vue)

## Components to update

- [src/components/partner_request/trip/tripPurposePicker/tripPurposePicker.vue](src/components/partner_request/trip/tripPurposePicker/tripPurposePicker.vue)
- [src/components/partner_request/trip/tripPreferenceForm/tripPreferenceForm.vue](src/components/partner_request/trip/tripPreferenceForm/tripPreferenceForm.vue)
- [src/components/partner_request/trip/transportationPicker/transportationPicker.vue](src/components/partner_request/trip/transportationPicker/transportationPicker.vue)
- [src/components/partner_request/SubApplication/SubApplication.vue](src/components/partner_request/SubApplication/SubApplication.vue)
- [src/components/partner_request/PRTypePicker/PRTypePicker.vue](src/components/partner_request/PRTypePicker/PRTypePicker.vue)
- [src/components/partner_request/PRTimelineItem/PRTimelineItem.vue](src/components/partner_request/PRTimelineItem/PRTimelineItem.vue)
- [src/components/partner_request/PRTimeline/PRTimeline.vue](src/components/partner_request/PRTimeline/PRTimeline.vue)
- [src/components/partner_request/PRImmersiveForm/PRImmersiveForm.vue](src/components/partner_request/PRImmersiveForm/PRImmersiveForm.vue)
- [src/components/partner_request/PRGeoElementFilter/PRGeoElementFilter.vue](src/components/partner_request/PRGeoElementFilter/PRGeoElementFilter.vue)
- [src/components/partner_request/PRForm/PRForm.vue](src/components/partner_request/PRForm/PRForm.vue)
- [src/components/partner_request/PRDraftPicker/PRDraftPicker.vue](src/components/partner_request/PRDraftPicker/PRDraftPicker.vue)
- [src/components/partner_request/PRApplyForm/PRApplyForm.vue](src/components/partner_request/PRApplyForm/PRApplyForm.vue)
- [src/components/partner_request/partnersEditor/partnersEditor.vue](src/components/partner_request/partnersEditor/partnersEditor.vue)
- [src/components/partner_request/PartnerEditor/PartnerEditor.vue](src/components/partner_request/PartnerEditor/PartnerEditor.vue)
- [src/components/partner_request/partnerPicker/partnerPicker.vue](src/components/partner_request/partnerPicker/partnerPicker.vue)
- [src/components/partner_request/Partner/Partner.vue](src/components/partner_request/Partner/Partner.vue)
- [src/components/base/routeItemDatetimeEditor/routeItemDatetimeEditor.vue](src/components/base/routeItemDatetimeEditor/routeItemDatetimeEditor.vue)
- [src/components/base/routeEditor/routeEditor.vue](src/components/base/routeEditor/routeEditor.vue)

## Notes

- Use the new JSONC import support in Vite (already added) for all local message files.
- Keep local keys as small, component-specific namespaces. Use global JSONC only for cross-component or shared domain messages.
- Convert any interpolation from function-style to named placeholders, e.g. `{value}`.
