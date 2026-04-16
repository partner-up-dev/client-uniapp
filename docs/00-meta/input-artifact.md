# Input route: Artifact

## Trigger

Use when the requested deliverable is a bounded artifact such as a one-off analysis, temporary script, migration helper, or structured output.

## Primary owner

- `tasks/` or the local work surface

## Forbidden

- Do not promote disposable tactics into durable architecture by default.
- Do not leave completion proof implicit.
- Do not introduce permanent tooling when task-local temporary tooling is enough.

## Read-do steps

1. Define the artifact output shape and completion proof.
2. Implement the smallest artifact that satisfies the request.
3. Keep assumptions and disposal rules local to the task.
4. Review whether any reusable lesson deserves promotion.

## Exit criteria

- The artifact exists and matches the expected output.
- Verification is complete.
- Promotion candidates are explicit, not silently assumed.
