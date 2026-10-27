# Optional feedback and action counts

This static candidate includes a voluntary feedback form and a consent-gated
client. It does not include or activate a backend. The standalone local preview
cannot accept submissions; an unavailable response leaves the draft visible.
Receipt confirmation can fail after storage succeeds, so there is no automatic
resend. Only HTTP 202 with exactly `{ok:true}` for events or `{ok:true,id}` with
a valid UUIDv4 for feedback confirms server acceptance, not a reply.

The two copied shared modules implement the Arcdrake v1 contract. Keep them
together and update them together; do not replace them with a separate API.

## Client behavior

- `POST /api/events` sends only `{product:"rehearsal",event}`. Valid event names
  are `page_view`, `feedback_open`, `tool_start`, `tool_complete`, `play_start`
  and `play_complete`. Rehearsal uses the first four. Page entry counts only if
  already opted in. Allowing counts does not replay earlier actions.
- Committed timing/availability/dependency changes and structural/load/reset
  actions emit `tool_start`; a valid completed schedule calculation emits
  `tool_complete`. Live text-entry keystrokes do not emit counts. Invalid schedules emit no completion.
  Startup and language-only demo redraws do not emit tool events. Counts can
  repeat during editing; they do not measure unique users, sessions or retention.
  Measurement failure never stops scheduling or saving.
- Counts default off. The only analytics preference is `arcdrake.analytics.v1`
  (`yes`/`no`) in origin-local storage. Off remains available; GPC and DNT `1`
  override Allow. With denied storage, the choice applies to this page and the UI
  explains that limitation. Failed opt-out overrides other clients sharing that
  storage object in the page, with best-effort removal of stale saved permission.
  If writing and removal both fail, an earlier opt-in can survive reload or in
  another tab; check the choice there too. Each event checks the current choice,
  including another tab's persisted opt-out.
- `POST /api/feedback` sends only product, category (`bug`, `idea`, `usability`,
  `other`), message, optional `replyTo` and noticeVersion `2026-10-27-mail-v1`. Opening or editing never submits.
  Sending requires the explicit form action and works while counts are off.
  Messages are trimmed, 1–2000 JavaScript string code units, allowing tabs and
  newlines but rejecting other controls. Optional email must be a trimmed valid
  email shape of at most 254 code units; empty email is omitted. Unknown fields
  fail validation. Feedback is not saved in browser storage or interpreted as HTML.
- Event payloads have no identity, event title, people, notes, save contents,
  URLs, query strings or arbitrary metadata. Sends omit credentials and referrers,
  reject redirects and never retry. A single 10-second deadline covers fetch and
  JSON reading; timeout restores controls and preserves the draft. The provider
  still sees connection metadata.

## Storage and contact notices

Arcdrake receives feedback for authorized triage operators and agents. Feedback
visibility expires after 30 days; hourly purge removes it from active storage
under normal operation, subject to platform failure. Counts cover the current
UTC day and previous 89 days. Provider backups/recovery have separate retention;
earlier collected records/exports retain their original deletion commitments. Revised-notice submissions follow the prospective policy below. Keep the receipt for deletion requests through the existing
contact route. No reply is guaranteed and prior aggregate contributions cannot
be linked to an individual or removed individually.

The form uses brief EN/DE wording; the full notice is available through its privacy link, and analytics controls live in a separate privacy choices window. Privacy links are
`https://tools.arcdrake.com/privacy/` and `/de/privacy/`; contact links are
`https://arcdrake.com/contact/` and `/de/contact/`. These are existing site pages;
activation must update the host privacy notice to match the optional intake.

## Hosting integration

Keep the exact root API paths on the publication's own origin, including when
the tool is mounted under `/rehearsal/`. No local or example hostname is embedded
as an ingestion endpoint. Configuration belongs to the host; do not introduce a
public cross-origin collector, wildcard CORS or client credentials.

The hosting Worker forwards the original HTTPS request through the private
`MEASUREMENT_FEEDBACK` service binding. Missing binding must return 503 JSON,
never static HTML or a false success. Preserve original URL, Origin and trusted
Cloudflare connection IP; do not trust invented proxy headers. The backend uses
an explicit `HOST_PRODUCTS` JSON map of exact HTTPS origins and allowed product
IDs. For the existing Tools origin the reviewed map includes `tools`, `rehearsal`,
`redact`, `shrink`, `unpack`, `maildns`. Other self-hosted origins need their own
exact reviewed entry. Unknown/malformed origins or products fail closed.

Both writes require same-origin POST JSON without query strings, valid UTF-8 and
a streamed maximum of 12,000 bytes. Errors are `{ok:false,error}` with bounded
codes: 400 `invalid`, 403 `origin`/`product`, 405 `method`, 413 `size`, 415 `type`,
429 `rate`, 503 `unavailable`/`capacity`. The client preserves these codes,
only with their exact HTTP status and response shape, normalizes malformed/network
responses to unavailable, and does not expose provider details. The UI reports
unconfirmed receipt and preserves input. Rate/capacity messages describe a service
limit rather than asking the visitor to change valid input. Page copy describes
availability neutrally on both standalone and integrated hosts.

Use the reviewed shared Worker/service-store integration, exact host map,
retention alarm, abuse limits and server-only triage/abuse secrets. Privileged
triage credentials never belong in public assets, URLs or client configuration.
This package contains no triage interface or secrets.

Before a separately authorized activation, verify provider allowances and backup
retention, service binding and original ingress propagation, missing-binding 503,
unauthenticated triage denial, hourly cleanup, bounded synthetic intake/deletion,
CSP `connect-src 'self'`, JavaScript MIME types and the final EN/DE host UX. Retain
the app's language buttons; the reviewed host wrapper hides its duplicate group
once both app controls are available. Production activation and browser review
are separate from this static package.

To roll back intake, remove client integration and host forwarding together (or
return explicit 503), preserving event editing and existing contact/static routes.
Keep retained-store cleanup running until feedback expires or is deliberately
deleted; do not delete storage as an incidental rollback.

## Consent and feedback notice update — 27 October 2026

This private source candidate copies the reviewed canonical shared client/contract from the integrated Sites repair (client SHA-256 `3534352a635b1a9daae53492056f51b7754d0c6f40316bb7b311ecd87f46dfb0`). Both copied modules are explicitly LF in `.gitattributes` to preserve byte parity across checkouts. No production push, API activation or deployment is included. Local task behavior and privacy gates remain intact.

The feedback area has a short intro and fields; analytics detail and equally usable allow/decline controls live in the separate branded Privacy choices window. Existing EN/DE privacy/contact links remain. The current client adds exact `noticeVersion: "2026-10-27-mail-v1"` to explicit feedback payloads. This identifies its notice version, not proof that a human read it. An old tab/client without the marker remains storage-only forever; it cannot be replayed into mail.

For revised-notice submissions the website working copy still expires after 30 days, with hourly cleanup under normal operation. Feedback also queues for forwarding through the existing Microsoft 365 transport to Arcdrake's business mailbox. Mailbox correspondence is deleted when no longer needed, subject to statutory obligations or necessary legal claims. A saved receipt confirms website storage/queueing, never inbox delivery or a human response. Existing collected records and exports/copies retain the original promises under which they were collected; there is no retroactive exemption or new manual mailbox/export deletion duty.

Host release must first accept the optional marker with `FEEDBACK_MAIL_ACTIVE="0"`, then supply the existing private mail entrypoint/binding and deploy all revised notices/client adapters. Verify service bindings and Operations Control delivery health before explicitly activating dispatch last. Marker-tagged messages queue while off without transport attempts; old/unmarked records remain legacy. Keep the deliberate active setting in later reviewed deployment configs. Standalone builds with a disabled collection switch remain disabled.

Candidate verification: `npm test` passed 27 tests. Shared client/contract byte parity matches the canonical LF Git blobs; source hashes are pinned where required. The local release package/build completed. No browser, physical-device, live backend or inbox verification is claimed by this source-propagation packet.

Locale startup repair: after mounting, the adapter announces the app-selected language through the existing `arcdrake-language-change` event. The native Privacy choices dialog therefore localizes its heading, purpose, disclosure, decline action and privacy URL on initial German entry and later EN/DE switches. The same form, draft and consent choice are retained. Native-dialog control-flow regression passes; browser verification is recorded separately by the release review.
