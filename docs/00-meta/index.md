# Meta engine

This layer owns reusable SVC workflow rules for this repository.

## Read order

- Start with root `AGENTS.md`.
- Load one input route only when the request type matters.
- Load one mode SOP only for the current working posture.
- Load `concepts.md` only when framework boundary language is unclear.

## Input routes

- `input-intent.md`
- `input-constraint.md`
- `input-reality.md`
- `input-artifact.md`

## Mode SOPs

- `mode-a-explore.md`
- `mode-b-solidify.md`
- `mode-c-execute.md`
- `mode-d-diagnose.md`

## Rules

- Input type decides durable ownership.
- Mode decides working posture.
- Alignment substrate is loaded only when MVT is not enough to constrain the work safely.
- Old SVC task folders are archive context, not current protocol.
