# Cross-domain interactions

## Account/Profile -> PartnerRequest

- Semantic contract: partner request surfaces may use account and profile context to display creator, applicant, or participant identity.
- Shared language: Profile, Partner, PartnerRequest.

## PartnerRequest -> PartnerRole

- Semantic contract: roles are meaningful only inside a partner request.
- Shared language: PartnerRequest, PartnerRole.

## PartnerApplication -> PartnerSubApplication

- Semantic contract: one application can include multiple role-specific sub-applications.
- Shared language: PartnerApplication, PartnerSubApplication, PartnerRole.

## PartnerSubApplication -> Partner status

- Semantic contract: approval of any sub-application is enough to approve the parent application.
- Shared language: approval, Partner, PartnerApplication.

## PartnerRequest -> Communication

- Semantic contract: chat and notification activity follows partner-request-related interaction and coordination.
- Shared language: Chat, Notification, PartnerRequest.

## Locale -> All user-facing surfaces

- Semantic contract: product-visible text should be expressible through locale-owned copy rather than hard-coded text.
- Shared language: Locale, user-facing copy.
