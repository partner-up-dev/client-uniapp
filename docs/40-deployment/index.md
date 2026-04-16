# Deployment Index

This layer owns runtime, environment, build, release, and operational truths that are costly to rediscover.

It does not own product behavior, cross-unit contracts, unit-local design memory, or task evidence.

## Files

- [topology.md](topology.md): runtime topology and external services
- [runtime-authority.md](runtime-authority.md): environment and platform authority
- [release-and-migration.md](release-and-migration.md): build, verification, and release migration checks
- [operational-hazards.md](operational-hazards.md): runtime hazards that should be checked before release-impacting changes

## Update Rules

- Update this layer when environment variables, build commands, platform targets, runtime services, or release/migration checks change.
- Do not add fake automation claims. If a check is manual, label it as manual.
- Keep task-local temporary audit scripts out of durable deployment policy unless they become real project tooling.
