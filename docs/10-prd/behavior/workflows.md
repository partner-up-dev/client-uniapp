# Workflows

## Launch and login

- Actor: app user
- Trigger: app launch
- Normal flow:
  - App launches.
  - Client attempts account login.
  - User proceeds with available session state.
- Exception flow:
  - If login is unavailable, account-dependent flows may require fallback or re-entry.
- Observable outcome: user reaches product surfaces with session state resolved as far as possible.

## Browse and view partner requests

- Actor: app user
- Trigger: user opens Home or Explore.
- Normal flow:
  - User browses partner request surfaces.
  - User opens a partner request detail.
- Exception flow:
  - If no matching requests are available, the surface should communicate empty or loading state.
- Observable outcome: user can evaluate whether a request is relevant.

## Apply to a partner request

- Actor: non-partner user for a request
- Trigger: user chooses to apply from request detail.
- Normal flow:
  - User selects one or more intended roles.
  - User provides role-specific application reason where required.
  - User submits a PartnerApplication containing PartnerSubApplications.
- Exception flow:
  - Invalid or incomplete applications should not be accepted as complete.
- Observable outcome: the request has a submitted application intent.

## Create a partner request

- Actor: request creator
- Trigger: user starts request creation.
- Normal flow:
  - User selects request type or creation path.
  - User fills structured request details.
  - User finalizes the request.
- Exception flow:
  - Incomplete required fields block completion.
- Observable outcome: a structured partner request is ready for publication or persistence.

## Chat and notifications

- Actor: app user with relevant activity
- Trigger: user opens chat or notification surfaces.
- Normal flow:
  - User sees message or activity state.
  - User opens a chat thread or relevant product surface.
  - Local unread/activity state updates as messages are viewed.
- Exception flow:
  - Missing or stale message history should be refreshed where supported.
- Observable outcome: user can follow up on partner-related activity.

## Profile management

- Actor: app user
- Trigger: user opens profile or account surface.
- Normal flow:
  - User views profile details.
  - User edits supported profile fields.
  - Changes become available to partner flows.
- Exception flow:
  - Unsupported or invalid edits are not accepted.
- Observable outcome: profile context remains usable across product surfaces.
