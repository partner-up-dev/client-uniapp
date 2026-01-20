# Locale Reorganization Plan

## Goal

Reorganize `src/locale` i18n messages into a structured domain-based architecture:

```
src/locale/
  ├── index.ts                    # i18n configuration
  ├── use.ts                      # useTranslate composable
  ├── types.ts                    # Type definitions
  ├── zh-Hans.ts                  # Main Chinese entry (aggregates all domains)
  ├── en-US.ts                    # Main English entry (aggregates all domains)
  ├── zh-Hans/
  │   ├── common.ts               # Commom & utilities
  │   ├── page.ts                 # Per-page domains aggregator (e.g., explore)
  │   ├── base.ts                 # Base domain (already exists)
  │   ├── account.ts              # Account domain (already exists)
  │   ├── onboarding.ts           # Onboarding flow (already exists)
  │   ├── partner_request.ts      # Partner request domain (already exists, with sub-files)
  │   ├── split_bill.ts           # Split bill domain (already exists as split_the_bill)
  │   └── communication.ts        # Chat, message, notification
  └── en-US/
     ├── common.ts               # Common translations
     ├── page.ts                 # Per-page domains aggregator (e.g., explore)
      ├── base.ts                 # Base translations
      ├── account.ts              # Account translations
      ├── onboarding.ts           # Onboarding translations
      ├── partner_request.ts      # Partner request translations
      ├── split_bill.ts           # Split bill translations
      └── communication.ts        # Communication translations
```

## Current State Analysis

### zh-Hans.ts (28,893 bytes)

Contains 16 inline domains that need extraction:

1. **common** (~2,500 bytes) - Component translations, toasts, forms
2. **pages** (~350 bytes) - Page titles
3. **api** (~2,800 bytes) - API error messages
4. **storage** (~100 bytes) - Storage toasts
5. **feed** (~500 bytes) - Feed display
6. **notification** (~300 bytes) - Notification page
7. **chat** (~1,800 bytes) - Chat functionality
8. **message** (~250 bytes) - Message types
9. **approval** (~350 bytes) - Approval flows
10. **contract** (~1,500 bytes) - Contract operations
11. **contract_legal_document** (~1,200 bytes) - Legal documents
12. **clause** + related (~200 bytes) - Clause components
13. **editor** (~2,000 bytes) - Complex editors
14. **account_picker** (~80 bytes) - Account picker
15. **home** (~400 bytes) - Home page
16. **me** (~800 bytes) - "Me" page

Already extracted (imported at top):

- ✅ base
- ✅ account
- ✅ onboarding
- ✅ partner_request (+ ride_hailing, commute, trip sub-domains)
- ✅ split_the_bill
- ✅ explore

### en-US.ts (1,137 bytes)

Severely incomplete - only has:

- Minimal common domain (~300 bytes)
- explore domain (imported)

**Missing:** account, base, onboarding, partner_request, split_the_bill, and all 16 inline domains from zh-Hans

### Issues to Fix

1. **Empty me/ folder** in `zh-Hans/` - indicates incomplete extraction
2. **Naming inconsistency** - `split_the_bill` folder should be `split_bill`
3. **TypeScript issues** - Missing type annotations for `named` parameter in function-based messages

## Domain Mapping Strategy

### Domain: `common`

**Source:** Inline in both zh-Hans.ts and en-US.ts
**Size:** ~2,500 bytes (zh-Hans), ~300 bytes (en-US)
**Content:**

- Component translations: `card`, `cell`, `field`
- Global utilities: `loading`, `load_more`, `picker`, `action_sheet`, `editor`
- Toast messages: `toast`
- Share options: `share`
- Error messages: `error`
- Personal pronouns: `personal_pronoun`
- Placeholders: `placeholder`
- Status tips: `status_tip`
- Buttons: `button`
- Form validation: `form` (complex, nested)
**Dependencies:** None (foundational)

### Domain: `base`

**Source:** Already extracted to `zh-Hans/base/index.ts` (5,687 bytes)
**Action:** Keep as-is, create en-US version
**Content:**

- Base UI components, map, route editing, gender/MBTI/location pickers
**Dependencies:** None (foundational)

### Domain: `account`

**Source:** Already extracted to `zh-Hans/account/index.ts` (7,140 bytes)
**Action:** Keep as-is, create en-US version
**Content:**

- User profile, OAuth, account states, account-specific API
**Dependencies:** `base` (for pickers)

### Domain: `onboarding`

**Source:** Already extracted to `zh-Hans/onboarding/index.ts` (3,907 bytes)
**Action:** Keep as-is, create en-US version
**Content:**

- Welcome flow, feature highlights, onboarding-specific APIs
**Dependencies:** `base` (for UI components)

### Domain: `partner_request`

**Source:** Already extracted to `zh-Hans/partner_request/index.ts` (11,346 bytes) + sub-domains
**Action:** Keep as-is, create en-US version
**Content:**

- Partner request core, application flows, creation wizard
- Sub-domains: `ride_hailing` (8,147 bytes), `commute` (1,629 bytes), `trip` (4,124 bytes)
- Approval flows (statuses, operations)
- Contract & legal document (operations, metadata, clauses)
**Dependencies:** `base`, `common`

### Domain: `split_bill`

**Source:** Already extracted to `zh-Hans/split_the_bill/index.ts` (14,034 bytes)
**Action:** Rename folder from `split_the_bill` to `split_bill`, create en-US version
**Content:**

- Bill metadata, creation, distribution, detailed views
**Dependencies:** `base`, `common`, `partner_request`

### Domain: `communication`

**Source:** Inline in zh-Hans.ts, not in en-US.ts
**Size:** ~2,350 bytes (zh-Hans), 0 bytes (en-US)
**Content to extract:**

- **chat** (~1,800 bytes) - Chat functionality, partner applications, message bar
- **message** (~250 bytes) - Content types, friendly content
- **notification** (~300 bytes) - Notification page
**Dependencies:** `base`, `common`

### Domain: `page`

**Source:** Split across folders (e.g., `zh-Hans/explore`) and inline titles
**Action:** Create aggregator `page.ts` in both locales; wire existing `explore` under it
**Content:**

- **explore** (existing subdomain) - discovery page filters, map controls, etc.
**Dependencies:** `base`, `common`

### Domains to keep inline in main files

These are small, cross-cutting concerns that don't warrant separate files:

- **pages** (~350 bytes) - Page titles (used for routing)
- **api** (~2,800 bytes) - API error messages (used everywhere)
- **storage** (~100 bytes) - Storage toasts
- **feed** (~500 bytes) - Feed display
- **editor** (~2,000 bytes) - Complex editors (used across domains)
- **account_picker** (~80 bytes) - Tiny component
- **home** (~400 bytes) - Home page specific
- **me** (~800 bytes) - "Me" page specific

**Rationale:** These domains are:

1. Small (<1KB each except `api` and `editor`)
2. Cross-cutting (used by multiple domains)
3. Page-specific (home, me, pages)
4. Better co-located with main entry for discoverability

## Implementation Steps

### Automation Script

- Create `scripts/reorg-locales.ts` to automate:
  - Ensure directories exist: `src/locale/zh-Hans`, `src/locale/en-US`
  - Generate aggregator files: `common.ts`, `page.ts`, `base.ts`, `account.ts`, `onboarding.ts`, `partner_request.ts`, `split_bill.ts`, `communication.ts` for both locales
  - Enforce folder rename: move `src/locale/zh-Hans/split_the_bill` → `src/locale/zh-Hans/split_bill`
  - Update imports in `src/locale/zh-Hans.ts` and `src/locale/en-US.ts` to wire new aggregators (including `page` for `explore`)
  - Keep content minimal (empty objects where content is not yet extracted); structure correctness is the priority

### Phase 1: Preparation & Immediate Rename (Critical)

1. **Enforce rename now**: `zh-Hans/split_the_bill/` → `zh-Hans/split_bill/`
2. **Update imports** in `zh-Hans.ts` to point to `./zh-Hans/split_bill`
3. **Remove empty me/ folder** in `zh-Hans/` if present
4. **Verify existing structure** - Read all existing domain files to ensure understanding

### Phase 2: Extract communication domain (zh-Hans)

1. **Create** `zh-Hans/communication.ts`
2. **Extract domains** from zh-Hans.ts:
   - `chat`
   - `message`
   - `approval`
   - `notification`
   - `contract`
   - `contract_legal_document`
   - `clause`
   - `clause_performers_editor`
   - `clause_quick_actions`
3. **Import and spread** in zh-Hans.ts

### Phase 3: Extract common domain (zh-Hans)

1. **Create** `zh-Hans/common.ts`
2. **Extract domain** `common` from zh-Hans.ts
3. **Import and spread** in zh-Hans.ts

### Phase 4: Reorganize zh-Hans.ts main file

1. **Keep inline domains:**
   - `pages`
   - `api`
   - `storage`
   - `feed`
   - `editor`
   - `account_picker`
   - `home`
   - `me`
2. **Organize imports** by domain order: common, base, account, onboarding, partner_request, split_bill, communication
3. **Verify structure** matches new architecture

### Phase 5: Create en-US domain files (All missing translations)

1. **Create** `en-US/common.ts` - Translate from zh-Hans/common.ts
2. **Create** `en-US/base.ts` - Translate from zh-Hans/base/index.ts
3. **Create** `en-US/account.ts` - Translate from zh-Hans/account/index.ts
4. **Create** `en-US/onboarding.ts` - Translate from zh-Hans/onboarding/index.ts
5. **Create** `en-US/page.ts` - Aggregate existing `explore` domain
6. **Create** `en-US/partner_request.ts` - Translate from zh-Hans/partner_request/index.ts (including sub-domains)
7. **Create** `en-US/split_bill.ts` - Translate from zh-Hans/split_bill/index.ts (renamed)
8. **Create** `en-US/communication.ts` - Translate from zh-Hans/communication.ts

### Phase 6: Reorganize en-US.ts main file

1. **Extract inline common** to `en-US/common.ts` (duplicate with Phase 6.1)
2. **Import all domains**: common, base, page, account, onboarding, partner_request, split_bill, communication
3. **Add inline domains** (translate from zh-Hans.ts):
   - `pages`
   - `api`
   - `storage`
   - `feed`
   - `editor`
   - `account_picker`
   - `home`
   - `me`
4. **Match structure** with zh-Hans.ts (including `page` domain)

### Phase 7: Verification & Testing

1. **Type check** - Run `pnpm type-check`
2. **Test build** - Ensure no import errors
3. **Manual verification** - Check key pages render correctly
4. **Check translation keys** - Ensure no missing keys

## File Size Estimates (After Reorganization)

### zh-Hans files

- `zh-Hans.ts` (main): ~8,000 bytes (down from 28,893)
  - Inline: pages, api, storage, feed, editor, account_picker, home, me
  - Imports: common, base, account, onboarding, partner_request, split_bill, communication
- `zh-Hans/common.ts`: ~2,500 bytes
- `zh-Hans/page.ts`: ~1,000 bytes (aggregating explore)
- `zh-Hans/base.ts`: ~5,687 bytes (existing)
- `zh-Hans/account.ts`: ~7,140 bytes (existing)
- `zh-Hans/onboarding.ts`: ~3,907 bytes (existing)
- `zh-Hans/partner_request.ts`: ~11,346 bytes (existing, + sub-files)
- `zh-Hans/split_bill.ts`: ~14,034 bytes (renamed from split_the_bill)
- `zh-Hans/communication.ts`: ~4,200 bytes (new)

### en-US files

- `en-US.ts` (main): ~8,000 bytes (up from 1,137)
  - Structure matches zh-Hans.ts
- `en-US/common.ts`: ~2,500 bytes (new)
- `en-US/page.ts`: ~900 bytes (aggregating explore)
- `en-US/base.ts`: ~5,687 bytes (new)
- `en-US/account.ts`: ~7,140 bytes (new)
- `en-US/onboarding.ts`: ~3,907 bytes (new)
- `en-US/partner_request.ts`: ~11,346 bytes (new, + sub-files if needed)
- `en-US/split_bill.ts`: ~14,034 bytes (new)
- `en-US/communication.ts`: ~4,200 bytes (new)

## Translation Strategy for en-US

Since en-US is severely incomplete, we need to decide on translation approach:

**Option A: Machine translation + Manual review**

- Use AI (Claude/GPT) to translate each domain file
- Review for context accuracy
- Pros: Fast, complete coverage
- Cons: May need iteration for domain-specific terms

**Option B: Placeholder + Progressive translation**

- Copy zh-Hans structure with English keys
- Use placeholder "TODO: Translate" for complex strings
- Translate high-priority domains first
- Pros: Maintains structure, allows incremental work
- Cons: Incomplete translations may break UI

**Option C: Copy Chinese as fallback + Mark for translation**

- Copy Chinese content as temporary fallback
- Mark with comment `// TODO: Translate`
- Rely on i18n fallback to zh-Hans
- Pros: No broken UI, clear TODO tracking
- Cons: Users see Chinese if locale is en-US

**Recommended: Option A (Machine translation + Manual review)**

- Provides complete, usable translations immediately
- Can be refined iteratively
- Maintains professional UX for English users

## Key Risks & Mitigations

### Risk 1: Breaking existing translation keys

**Impact:** High - UI may show missing translation keys
**Mitigation:**

- Keep inline domains in main files (pages, api, storage, feed, editor, account_picker, home, me)
- Only extract large, self-contained domains
- Test key pages after each extraction

### Risk 2: Import path errors

**Impact:** High - Build failures
**Mitigation:**

- Fix broken imports in Phase 1 before any extraction
- Use absolute imports or consistent relative paths
- Verify with type-check after each phase

### Risk 3: TypeScript type errors

**Impact:** Medium - Type check failures
**Mitigation:**

- Ensure all extracted files export default object
- Match existing export patterns
- Run `pnpm type-check` after each phase

### Risk 4: Inconsistent domain boundaries

**Impact:** Low - Future maintenance issues
**Mitigation:**

- Follow existing domain boundaries (account, partner_request, etc.)
- Document domain responsibilities in comments
- Keep cross-cutting concerns inline (api, pages)

### Risk 5: Large PR / difficult review

**Impact:** Medium - Reviewer fatigue
**Mitigation:**

- Break into multiple PRs if needed (Phase 1-3, Phase 4-5, Phase 6-7)
- Each phase can be independently verified
- Provide clear before/after diffs

## Success Criteria

1. ✅ All domains organized as specified: common, base, account, onboarding, partner_request, split_bill, communication
2. ✅ zh-Hans.ts reduced from ~28KB to ~8KB (inline domains only)
3. ✅ en-US.ts complete with all domains (~8KB main + domain files)
4. ✅ Folder naming consistent: `split_bill` (not `split_the_bill`)
5. ✅ No broken imports (index.ts, main files, domain files)
6. ✅ Type check passes (`pnpm type-check`)
7. ✅ Build succeeds for mp-weixin target
8. ✅ Key pages render correctly (home, explore, account, partner_request detail)
9. ✅ All translation keys accessible (no missing translations)
10. ✅ Empty folders removed (me/)

## Notes

- **Backward compatibility:** Not maintained - this is a breaking refactor
- **zh-yue-Hant.ts:** Out of scope - will update separately if needed
- **Sub-domain files:** Keep existing structure for partner_request (ride_hailing, commute, trip)
- **Import pattern:** Use `import domain from './zh-Hans/domain'` (and `./en-US/domain`) then spread `...domain` in export; `page.ts` aggregates existing `explore`
- **Naming:** Follow snake_case for domain keys and file names
- **Comments:** Preserve JSDoc comments explaining domain purpose
