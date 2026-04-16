# Claim Realization Matrix

This matrix maps PRD claims to technical realization anchors. It is not proof that a claim is complete; verification status stays explicit.

| PRD claim | Primary realization anchors | Cross-unit contracts | Verification status |
| --- | --- | --- | --- |
| Browse partner requests | `src/pages/explore/explore.vue`, `src/pages/home/home.vue`, `src/business/partner_request/`, `src/components/partner_request/PRCard/` | Navigation, i18n, partner request domain models | Manual surface check only; ranking and matching rules remain open in PRD. |
| Create partner requests | `src/pages/partner_request/create_trip/create_trip.vue`, `src/pages/partner_request/create_end/create_end.vue`, `src/components/partner_request/PRImmersiveForm/`, `src/components/partner_request/PRForm/` | Navigation, partner request form/model boundary, locale bundles | Manual flow check only; backend persistence behavior remains partially open. |
| Apply to partner requests | `src/pages/partner_request/detail/detail.vue`, `src/components/partner_request/PRApplyForm/`, `src/components/partner_request/SubApplication/`, `src/business/partner_request/` | Partner application model, role/sub-application invariant, auth headers | Manual check only; moderation and approval policy are open product questions. |
| Chat with partners | `src/pages/communication/chat.vue`, `src/components/communication/ChatContent/`, `src/store/communication/chat.ts`, `src/business/communication/` | Message retrieval/send boundary, unread state, auth headers | Unit TDD exists for communication chat flow; automated tests are not documented yet. |
| View notifications | `src/pages/notification/notification.vue`, `src/components/communication/ChatEntry/`, `src/store/communication/chat.ts`, `src/business/communication/chat.ts`, `src/utils/tabbar.ts` | Chat list state, unread state, latest-message preview, tabbar state | Unit TDD exists for communication chat flow; tabbar badge behavior needs explicit verification when changed. |
| Manage profile | `src/pages/account/profile/profile.vue`, `src/business/account/`, `src/store/account/` | Account state, auth token propagation, profile model boundary | Manual check only; verification/trust workflows remain open product questions. |

## Matrix Rules

- Add a row only for a PRD claim that exists in [../10-prd/behavior/claims.md](../10-prd/behavior/claims.md).
- Keep anchors technical and current; do not encode product why here.
- If verification is missing, say so instead of implying coverage.
