# Rules and invariants

## Partner is request-relative

- Rule: a Partner exists only relative to a PartnerRequest.
- Rationale: partnering is contextual; the same user may hold different roles in different requests.
- Violation impact: profile-level identity could be confused with request-level participation.
- Linked claims: Apply to partner requests, Chat with partners

## Joining creates partner status

- Rule: a user becomes a Partner in a request by joining or being accepted into that request.
- Rationale: Partner status must be grounded in request participation, not passive browsing.
- Violation impact: users could appear as participants without a valid join path.
- Linked claims: Apply to partner requests

## Roles define expectations

- Rule: PartnerRole defines rights, obligations, or participation expectations inside a PartnerRequest.
- Rationale: role-specific structure reduces ambiguity between request creators and applicants.
- Violation impact: applications become unclear and approval decisions lose meaning.
- Linked claims: Apply to partner requests, Create partner requests

## Applications can contain multiple sub-applications

- Rule: a PartnerApplication may include multiple PartnerSubApplications.
- Rationale: one user may be willing to play different roles in the same request.
- Violation impact: the product would force unnecessary duplicate applications or lose role intent.
- Linked claims: Apply to partner requests

## Any approved sub-application approves the whole application

- Rule: approval of any PartnerSubApplication marks the PartnerApplication as approved.
- Rationale: the application succeeds if the user is accepted into at least one requested role.
- Violation impact: UI and backend could disagree on whether the user may participate.
- Linked claims: Apply to partner requests
