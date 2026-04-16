# Derived boundaries

Domain boundaries in this file are derived from PRD drivers and behavior. They do not create new product obligations by themselves.

## Account and profile

- Derivation source: [behavior/claims.md](../behavior/claims.md), [_drivers/business-and-service-objectives.md](../_drivers/business-and-service-objectives.md)
- Boundary intent: stabilize user identity and profile context used by partner flows.

## Partner request

- Derivation source: [behavior/claims.md](../behavior/claims.md), [behavior/workflows.md](../behavior/workflows.md)
- Boundary intent: represent the structured request users create, browse, view, and apply to.

## Partner role and participation

- Derivation source: [behavior/rules-and-invariants.md](../behavior/rules-and-invariants.md), [glossary.md](../glossary.md)
- Boundary intent: express role-specific expectations and request-relative partner status.

## Application

- Derivation source: [behavior/rules-and-invariants.md](../behavior/rules-and-invariants.md), [behavior/workflows.md](../behavior/workflows.md)
- Boundary intent: represent a user's intent to join one or more roles in a request.

## Communication

- Derivation source: [behavior/claims.md](../behavior/claims.md), [_drivers/market-and-user-pressures.md](../_drivers/market-and-user-pressures.md)
- Boundary intent: support partner-related coordination through chat and notifications.

## Locale

- Derivation source: [_drivers/market-and-user-pressures.md](../_drivers/market-and-user-pressures.md), [_drivers/hard-constraints.md](../_drivers/hard-constraints.md)
- Boundary intent: keep user-facing copy stable across supported languages.
