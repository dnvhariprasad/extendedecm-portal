# ExtendedECM Portal Jira-Style Delivery Plan

This file tracks Jira-style implementation tickets for the ExtendedECM Portal. Use these IDs in branch names, commits, PR titles, and release notes.

Branch naming convention:

```text
jira/EXCM-<number>-short-description
```

Commit message convention:

```text
EXCM-<number>: <imperative summary>
```

PR title convention:

```text
EXCM-<number>: <user-facing summary>
```

## Workflow Per Ticket

1. Create branch from latest `main`.
2. Implement the ticket scope only.
3. Run verification commands.
4. Commit changes.
5. Push branch to GitHub.
6. Create PR to `main`.
7. Review PR diff and checks.
8. Merge PR into `main`.
9. Pull/update local `main`.

## Bootstrap

### EXCM-000: Bootstrap Repository Baseline

Type: Task
Priority: P0
Epic: Project Foundation

Summary:

Establish the initial repository baseline because the GitHub repo is empty and cannot receive normal feature PRs until `main` exists.

Acceptance criteria:

- Initial scaffold is committed to `main`.
- `main` is pushed to GitHub.
- `.env.local` and secrets are not committed.
- Build, lint, and typecheck pass before push.

Tasks:

- Verify local build.
- Verify Git ignored files.
- Commit scaffold and planning docs.
- Push `main`.

## MVP Tickets

### EXCM-001: Configure CI Verification

Type: Story
Priority: P0
Epic: Project Foundation

As the portal owner, I want GitHub verification on every PR so that build, lint, and type errors are caught before merge.

Acceptance criteria:

- GitHub Actions workflow runs on PRs and pushes to `main`.
- Workflow installs dependencies with `npm ci`.
- Workflow runs `npm run lint`, `npm run typecheck`, and `npm run build`.
- Workflow passes on the PR branch.

Tasks:

- Add `.github/workflows/ci.yml`.
- Configure Node.js version.
- Use npm cache.
- Verify workflow syntax locally where possible.

### EXCM-002: Apply Supabase Schema And Seed Owner Setup Documentation

Type: Story
Priority: P0
Epic: Supabase Data And Security

As the portal owner, I want the initial Supabase schema and owner setup documented so that the CMS can persist content securely.

Acceptance criteria:

- `supabase/schema.sql` is reviewed and ready to run.
- Owner profile setup steps are documented.
- Storage bucket setup steps are documented.
- RLS expectations are documented.

Tasks:

- Add Supabase setup runbook.
- Add first owner insert template.
- Add bucket naming guidance.
- Add verification SQL queries.

### EXCM-003: Verify Supabase Auth Login End-To-End

Type: Story
Priority: P0
Epic: Admin Authentication And Authorization

As a team editor, I want to sign in through Supabase Auth so that I can access the admin workspace.

Acceptance criteria:

- `/admin/login` accepts valid Supabase credentials.
- Invalid credentials show an error.
- Successful login redirects to `/admin`.
- `/admin` redirects anonymous users to `/admin/login`.

Tasks:

- Confirm Supabase auth provider settings.
- Test login locally.
- Add logout action.
- Add authenticated admin header state.

### EXCM-004: Add Database Access Layer

Type: Story
Priority: P0
Epic: Supabase Data And Security

As a developer, I want centralized data access helpers so that public and admin pages do not duplicate Supabase queries.

Acceptance criteria:

- Product reads are centralized.
- Article reads are centralized.
- Admin mutations have a clear server-side entry point.
- Query errors return consistent messages.

Tasks:

- Add database row types.
- Add article query helpers.
- Add product query helpers.
- Add admin mutation helpers.
- Add basic unit coverage where practical.

### EXCM-005: Build Admin Article List

Type: Story
Priority: P1
Epic: CMS Content Editing

As an editor, I want to see articles in the admin area so that I can manage portal content.

Acceptance criteria:

- `/admin/articles` lists articles from Supabase.
- List shows title, status, product, content type, and updated date.
- List has a create article action.
- Protected route requires authentication.

Tasks:

- Add route and navigation link.
- Add article list query.
- Add table/list UI.
- Add status badges.
- Add empty state.

### EXCM-006: Build Article Create Flow

Type: Story
Priority: P1
Epic: CMS Content Editing

As an editor, I want to create draft articles so that new knowledge can be added safely.

Acceptance criteria:

- `/admin/articles/new` creates draft articles.
- Form captures title, slug, excerpt, product, category, content type, and status.
- Slug can be generated from title.
- Save persists draft content to Supabase.

Tasks:

- Add create route.
- Add article form component.
- Add validation.
- Add create mutation.
- Redirect to edit page after save.

### EXCM-007: Build Article Edit Metadata Flow

Type: Story
Priority: P1
Epic: CMS Content Editing

As an editor, I want to edit article metadata so that content stays accurate.

Acceptance criteria:

- `/admin/articles/[id]` loads an article by ID.
- Editor can update metadata fields.
- Duplicate/invalid slugs are rejected.
- Save state and errors are visible.

Tasks:

- Add edit route.
- Add article load helper.
- Add update mutation.
- Add validation and error UI.
- Add dirty-state handling later if needed.

### EXCM-008: Build First-Release Block Editor

Type: Story
Priority: P1
Epic: CMS Content Editing

As an editor, I want to add, edit, reorder, and remove content blocks so that articles can be composed visually.

Acceptance criteria:

- Editor can manage heading, rich text, note, code, Mermaid, and steps blocks.
- Blocks save as portable JSON.
- Public article renderer can render saved blocks.
- Unknown block data does not crash the editor or public page.

Tasks:

- Define block schemas.
- Add block picker.
- Add per-block editor components.
- Add reorder and remove actions.
- Add preview support.

### EXCM-009: Build Publish And Unpublish Flow

Type: Story
Priority: P1
Epic: CMS Content Editing

As an editor, I want publishing controls so that incomplete content remains private.

Acceptance criteria:

- Draft articles are hidden publicly.
- Published articles are visible publicly.
- Publish action sets `published_at`.
- Unpublish hides content without deleting it.

Tasks:

- Add publish action.
- Add unpublish action.
- Update public queries.
- Verify RLS behavior.
- Add admin status indicators.

### EXCM-010: Add Pagefind Search

Type: Story
Priority: P1
Epic: Search And Discovery

As a public reader, I want search so that I can find products, errors, snippets, and guides quickly.

Acceptance criteria:

- Pagefind index is generated for public pages.
- Search UI returns product and article results.
- Search does not require a hosted search service.
- Admin/private routes are not indexed.

Tasks:

- Add Pagefind build integration.
- Add search route or modal.
- Add search result UI.
- Verify index output in local build.

### EXCM-011: Connect Vercel Deployment

Type: Story
Priority: P0
Epic: Deployment And Domain

As the portal owner, I want Vercel deployment configured so that the site can be tested publicly.

Acceptance criteria:

- Vercel imports the GitHub repository.
- Production build succeeds.
- Environment variables are configured.
- Preview deployments work for PRs.

Tasks:

- Connect Vercel project.
- Add env vars.
- Verify production build.
- Document deployment URL.

### EXCM-012: Connect Custom Domain

Type: Story
Priority: P0
Epic: Deployment And Domain

As the portal owner, I want `extendedecm.com` connected so that the portal uses the final public domain.

Acceptance criteria:

- `extendedecm.com` resolves to Vercel.
- `www.extendedecm.com` resolves or redirects correctly.
- SSL is active.
- DNS records are documented.

Tasks:

- Add domain in Vercel.
- Update GoDaddy DNS.
- Verify apex and `www`.
- Add DNS notes to docs.

### EXCM-013: Add Sitemap And Robots

Type: Story
Priority: P1
Epic: Deployment And Domain

As a public reader, I want search engines to discover public pages so that portal content is findable.

Acceptance criteria:

- Sitemap includes public pages.
- Robots allows public indexing.
- Admin routes are disallowed.
- Metadata is present for key routes.

Tasks:

- Add sitemap route.
- Add robots route.
- Add metadata review.
- Verify generated URLs.

### EXCM-014: Add Backup And Export Workflow

Type: Story
Priority: P1
Epic: Operations

As the portal owner, I want structured exports so that portal knowledge remains portable.

Acceptance criteria:

- Articles can be exported to JSON.
- Product/category/tag data can be exported.
- Media manifest can be exported.
- Export process is documented.

Tasks:

- Add export script.
- Add content JSON export.
- Add media manifest export.
- Add restore notes.

### EXCM-015: Create First Launch Content Set

Type: Story
Priority: P1
Epic: Content Quality

As a public reader, I want useful initial content so that the portal has value at launch.

Acceptance criteria:

- At least one Documentum overview article exists.
- At least one troubleshooting article exists.
- At least one diagram-backed article exists.
- Product summaries are not placeholders.

Tasks:

- Draft Documentum overview.
- Draft DQL basics note.
- Draft error-resolution template.
- Draft diagram source practice note.
- Review branding/legal language.

## Post-MVP Tickets

### EXCM-016: Build Media Upload Manager

Type: Story
Priority: P1
Epic: Media Management

As an editor, I want to upload media so that articles can include screenshots, diagrams, and source files.

Acceptance criteria:

- Admin users can upload allowed files.
- Uploads create `media_assets` records.
- Uploaded media can be selected in article blocks.
- Invalid file types and size issues show clear errors.

Tasks:

- Create Supabase buckets.
- Add storage policies.
- Add upload UI.
- Add media picker.
- Add validation.

### EXCM-017: Add Draw.io And Excalidraw Diagram Blocks

Type: Story
Priority: P2
Epic: Block And Diagram System

As an editor, I want to preserve editable diagram source files so that diagrams can be maintained later.

Acceptance criteria:

- `.drawio` and `.excalidraw` files can be attached.
- Rendered image and source file are linked.
- Public page shows rendered diagram and source option.

Tasks:

- Extend media schema usage.
- Add diagram asset block.
- Add renderer.
- Add admin editor controls.

### EXCM-018: Build Error Catalog

Type: Story
Priority: P2
Epic: Rich Knowledge Features

As a public reader, I want a searchable error catalog so that I can resolve known issues quickly.

Acceptance criteria:

- Error entries include exact error text, product, symptoms, root cause, and resolution.
- Exact error strings are searchable.
- Entries link to related articles and snippets.

Tasks:

- Add schema.
- Add public error index/detail pages.
- Add admin editor.
- Add search metadata.

### EXCM-019: Build DQL And Script Library

Type: Story
Priority: P2
Epic: Rich Knowledge Features

As a developer, I want a snippet library so that reusable DQL and scripts are easy to find.

Acceptance criteria:

- Snippets have language/type, product, description, and code.
- Snippets can be copied.
- Snippets link to related articles.

Tasks:

- Add snippet schema.
- Add snippet pages.
- Add copy button.
- Add admin editor.
- Add filters.

### EXCM-020: Build Learning Paths

Type: Story
Priority: P2
Epic: Rich Knowledge Features

As a learner, I want guided paths so that I can learn a product area in order.

Acceptance criteria:

- Learning paths group articles in sequence.
- Path pages show ordered learning steps.
- Paths can be product-specific.

Tasks:

- Add schema.
- Add path pages.
- Add ordered article picker.
- Add admin editor.

## Current Execution Queue

1. EXCM-000: Bootstrap Repository Baseline
2. EXCM-001: Configure CI Verification
3. EXCM-002: Apply Supabase Schema And Seed Owner Setup Documentation
4. EXCM-003: Verify Supabase Auth Login End-To-End
5. EXCM-004: Add Database Access Layer
