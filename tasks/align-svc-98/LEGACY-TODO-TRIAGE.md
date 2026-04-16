# Legacy TODO Triage

Status: Completed
Owner: Codex
Date: 2026-04-13

Source: root `todo.md`

## Decision

The root `todo.md` file was a mixed backlog and should not remain as a durable source of truth.

Active product direction now belongs in `docs/10-prd/`. Cross-unit technical obligations belong in `docs/20-product-tdd/`, unit-local design memory in `docs/30-unit-tdd/`, and runtime/release concerns in `docs/40-deployment/`.

## Triage Summary

Product backlog themes already represented as PRD scope or open questions:

- auth/profile login, registration, student verification, phone edit
- partner request creation, backend integration, editing, publish flow
- applications, participation, approval/rejection, withdrawal
- explore backend results, matching/ranking, map result behavior
- collections, sharing, invitation, onboarding, trust
- partner type expansion such as carpool, concert, shopping, merch, beauty

Technical/convention themes already represented by current durable owners:

- i18n rework and hard-coded text cleanup: `docs/20-product-tdd/cross-unit-contracts.md`, locale guidance, and `.github/instructions`
- `pages.json` as route authority: `docs/15-alignment/ui-surface-map.md`, `docs/20-product-tdd/cross-unit-contracts.md`, `src/pages/FILESYSTEM.md`
- component and utility cleanup: local component docs, `src/utils/README.md`, and future task work

## Residual Risk

This triage intentionally preserves themes, not every checkbox. If a deleted checkbox becomes actionable, open a new task with a current MVT packet and promote durable truth only after owner selection.
