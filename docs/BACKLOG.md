# ExtendedECM Portal Backlog

This backlog breaks the PRD into implementable stories and engineering tasks. Story IDs are stable references for planning, commits, and PR descriptions.

## Priority Legend

- P0: Required before first public launch.
- P1: Important for useful team adoption.
- P2: Post-launch improvement.

## Epic 1: Project Foundation

### E1-S1: Maintain A Buildable Next.js Project

As the portal owner, I want the project to build, lint, and typecheck reliably so that changes can be deployed safely.

Priority: P0

Acceptance criteria:

- `npm run typecheck` passes.
- `npm run lint` passes.
- `npm run build` passes.
- Generated artifacts and secret files are ignored by Git.
- README explains local setup.

Tasks:

- Keep `package.json` scripts current.
- Keep `.gitignore` aligned with Next.js, Vercel, env, and generated search artifacts.
- Document required environment variables in `.env.example`.
- Add CI workflow after the first GitHub push.
- Track npm audit advisories and avoid unsafe forced upgrades.

### E1-S2: Prepare Repository For GitHub And Vercel

As the portal owner, I want the repo ready for GitHub and Vercel so that deployment setup is straightforward.

Priority: P0

Acceptance criteria:

- Git remote points to `dnvhariprasad/extendedecm-portal`.
- Main branch contains scaffolded app.
- Vercel can import the repo without custom build hacks.
- Required env vars are documented for Vercel.

Tasks:

- Commit scaffold.
- Push `main` to GitHub.
- Add Vercel project.
- Add production env vars in Vercel.
- Confirm Vercel build output.

## Epic 2: Public Portal Experience

### E2-S1: Homepage

As a public reader, I want a clear homepage so that I understand what the portal covers and where to start.

Priority: P0

Acceptance criteria:

- Homepage explains the portal purpose.
- Homepage surfaces primary product areas.
- Homepage links to products and sample guides.
- Homepage includes no misleading affiliation language.
- Layout is responsive on mobile and desktop.

Tasks:

- Refine homepage copy.
- Add real product area summaries.
- Add primary and secondary calls to action.
- Add responsive QA checks.
- Add metadata title and description.

### E2-S2: Product Index

As a public reader, I want to browse products so that I can find the area relevant to my project.

Priority: P0

Acceptance criteria:

- `/products` lists all initial product areas.
- Each product card shows name, summary, and focus areas.
- Each card links to a stable product detail URL.
- Page renders without requiring authentication.

Tasks:

- Finalize product list.
- Finalize slug strategy.
- Add product cards.
- Add empty-state behavior for future dynamic content.
- Add metadata.

### E2-S3: Product Detail Pages

As a public reader, I want product-specific pages so that each ecosystem area has a stable knowledge hub.

Priority: P0

Acceptance criteria:

- `/products/[slug]` renders each initial product.
- Page shows summary and focus areas.
- Unknown product slugs return 404.
- Page can later show related articles.

Tasks:

- Implement static params for known products.
- Add related article placeholder.
- Add product page metadata.
- Add "portal status" or contribution note.
- Later replace sample data with Supabase-backed build-time data.

### E2-S4: Article Detail Rendering

As a public reader, I want readable article pages with structured blocks so that complex technical knowledge is easy to follow.

Priority: P0

Acceptance criteria:

- `/articles/[slug]` renders article title, excerpt, type, and body.
- Article body supports heading, rich text, note, code, Mermaid, and steps blocks.
- Unknown article slugs return 404.
- Block rendering is responsive.

Tasks:

- Keep block renderer typed.
- Add visual polish for each first-release block.
- Add article metadata.
- Add empty/fallback handling for malformed blocks.
- Add a sample article per major content style.

### E2-S5: Legal Disclaimer

As the portal owner, I want the site to clearly state independence from OpenText so that branding is accurate.

Priority: P0

Acceptance criteria:

- Footer includes the non-affiliation disclaimer.
- Disclaimer is visible on all public pages.
- Copy does not imply endorsement or sponsorship.

Tasks:

- Keep disclaimer in shared footer.
- Review homepage and product copy for affiliation risk.
- Add a later dedicated disclaimer/about page if needed.

## Epic 3: Admin Authentication And Authorization

### E3-S1: Supabase Auth Login

As a team editor, I want to sign in securely so that I can access the CMS.

Priority: P0

Acceptance criteria:

- `/admin/login` shows email/password login.
- Valid Supabase users can sign in.
- Invalid sign-in attempts show a helpful error.
- Successful login redirects to `/admin`.

Tasks:

- Confirm email/password provider in Supabase.
- Test login with first admin account.
- Add loading and error states.
- Add password reset or magic-link flow later.

### E3-S2: Protect Admin Dashboard

As the portal owner, I want `/admin` protected so that anonymous visitors cannot access editor features.

Priority: P0

Acceptance criteria:

- Anonymous users visiting `/admin` are redirected to `/admin/login`.
- Authenticated users can access `/admin`.
- Protected page does not expose service role keys.

Tasks:

- Verify Supabase server client session handling.
- Add middleware if session refresh requires it.
- Add logout action.
- Add admin navigation.

### E3-S3: Role-Based Admin Access

As the portal owner, I want owner/editor/viewer roles so that access can be controlled by responsibility.

Priority: P1

Acceptance criteria:

- `profiles.role` supports owner, editor, and viewer.
- Only owner/editor users can create or edit content.
- Viewer users can access read-only admin views if implemented.
- Unauthorized users see a clear access-denied state.

Tasks:

- Seed first owner profile.
- Add server-side role lookup helper.
- Add route-level role checks.
- Add RLS policy verification.
- Add admin user management later.

## Epic 4: Supabase Data And Security

### E4-S1: Apply Initial Schema

As the portal owner, I want the initial database schema applied so that content can be persisted.

Priority: P0

Acceptance criteria:

- `supabase/schema.sql` runs successfully in Supabase.
- Tables exist for profiles, products, categories, tags, articles, article_tags, media_assets, and redirects.
- RLS is enabled.
- Public published content can be read.
- Editor-managed content requires proper authorization.

Tasks:

- Review `schema.sql`.
- Run SQL in Supabase SQL Editor.
- Create first auth user.
- Insert matching `profiles` row with owner role.
- Add seed data script later.

### E4-S2: Database Access Layer

As a developer, I want typed data access helpers so that pages and admin screens do not duplicate Supabase queries.

Priority: P0

Acceptance criteria:

- Public content queries are centralized.
- Admin content mutations are centralized.
- Types map cleanly to database rows and block schemas.
- Errors are handled predictably.

Tasks:

- Add generated or handwritten database types.
- Add `lib/data/products.ts`.
- Add `lib/data/articles.ts`.
- Add `lib/data/media.ts`.
- Add error helpers for admin mutations.

### E4-S3: Secret Hygiene

As the portal owner, I want secrets handled safely so that the repo can be public.

Priority: P0

Acceptance criteria:

- `.env.local` is ignored.
- Service role key is not committed.
- Database password is not committed.
- Vercel env vars are documented.
- Any exposed privileged secret is rotated before production.

Tasks:

- Run `git status --ignored .env.local` before commit.
- Search for accidental secret strings before commit.
- Add pre-commit secret scanning later.
- Rotate DB password if needed before production.

## Epic 5: CMS Content Editing

### E5-S1: Admin Article List

As an editor, I want to see existing articles so that I can manage portal content.

Priority: P1

Acceptance criteria:

- `/admin/articles` lists articles.
- List shows title, status, product, content type, updated date.
- List supports draft and published content.
- Each row links to edit page.

Tasks:

- Add admin route.
- Add article query.
- Add table/list UI.
- Add status badges.
- Add create article button.

### E5-S2: Create Article

As an editor, I want to create an article so that new knowledge can be added.

Priority: P1

Acceptance criteria:

- `/admin/articles/new` shows article form.
- Editor can enter title, slug, excerpt, type, product, category, and status.
- Editor can add initial blocks.
- Save creates a draft in Supabase.

Tasks:

- Add form component.
- Add slug generation from title.
- Add product/category selectors.
- Add server action or API route for create.
- Add validation.

### E5-S3: Edit Article Metadata

As an editor, I want to edit article metadata so that published content stays accurate.

Priority: P1

Acceptance criteria:

- `/admin/articles/[id]` loads an existing article.
- Editor can update title, slug, excerpt, type, product, category, tags, and status.
- Save persists changes.
- Validation prevents duplicate or invalid slugs.

Tasks:

- Add edit route.
- Add load article helper.
- Add update mutation.
- Add optimistic or explicit save state.
- Add dirty-state warning later.

### E5-S4: Block Add/Edit/Reorder

As an editor, I want to compose articles with blocks so that content is structured and visually useful.

Priority: P1

Acceptance criteria:

- Editor can add first-release block types.
- Editor can edit block content.
- Editor can reorder blocks.
- Editor can remove blocks.
- Saved blocks render on public article pages.

Tasks:

- Create block schema definitions.
- Add block picker.
- Add block editor components.
- Add reorder controls.
- Add block validation.
- Reuse public block renderer for preview where practical.

### E5-S5: Publish And Unpublish

As an editor, I want draft/publish controls so that incomplete content is not public.

Priority: P1

Acceptance criteria:

- Draft articles are hidden from public pages.
- Published articles are visible publicly.
- Publishing sets `published_at`.
- Unpublishing hides content without deleting it.

Tasks:

- Add publish action.
- Add unpublish action.
- Update public queries to filter published content.
- Add status indicator in admin.
- Verify RLS behavior.

## Epic 6: Block And Diagram System

### E6-S1: First-Release Block Renderer Hardening

As a public reader, I want block rendering to be consistent so that articles are easy to scan.

Priority: P0

Acceptance criteria:

- Heading, rich text, note, code, Mermaid, and steps blocks render consistently.
- Unknown block types do not break the page.
- Long code lines scroll horizontally.
- Mobile layout remains readable.

Tasks:

- Add unknown block fallback.
- Add renderer tests.
- Add mobile QA.
- Add code language labels.
- Add note variants polish.

### E6-S2: Mermaid Diagram Block

As an editor, I want Mermaid diagrams so that sequence and flow diagrams are easy to create and migrate later.

Priority: P0

Acceptance criteria:

- Mermaid source renders client-side.
- Mermaid source remains visible in a details/fallback area.
- Render errors are displayed without breaking the article.
- Diagram container is responsive.

Tasks:

- Keep Mermaid renderer isolated in client component.
- Add syntax error UI.
- Add sample sequence diagram.
- Add flowchart sample later.
- Add accessibility title handling.

### E6-S3: Draw.io And Excalidraw Source Preservation

As an editor, I want to attach source diagram files so that diagrams can be edited later.

Priority: P2

Acceptance criteria:

- Media assets can store `.drawio` and `.excalidraw` files.
- Article blocks can reference source and rendered export.
- Public page can show rendered image and download/source link if allowed.

Tasks:

- Add media upload manager.
- Add diagram asset block.
- Add allowed MIME/type validation.
- Add source/export relationship fields.
- Add public renderer.

## Epic 7: Search And Discovery

### E7-S1: Pagefind Search Index

As a public reader, I want search so that I can quickly find products, errors, snippets, and guides.

Priority: P1

Acceptance criteria:

- Build generates a Pagefind index for public pages.
- Search can find article titles and body content.
- Search can find product pages.
- Search works without a hosted search service.

Tasks:

- Configure Pagefind build command.
- Add search index generation to production build flow.
- Add search UI.
- Add search result page or modal.
- Verify Vercel build output includes index.

### E7-S2: Search Filters

As a public reader, I want filters so that I can narrow results by product or content type.

Priority: P2

Acceptance criteria:

- Search results can show product/content type metadata.
- User can filter by product.
- User can filter by content type.

Tasks:

- Add metadata to indexed pages.
- Add filter UI.
- Add result grouping.
- Add no-results suggestions.

### E7-S3: Related Content

As a public reader, I want related links so that I can continue learning without searching again.

Priority: P1

Acceptance criteria:

- Article pages show related product and related articles.
- Product pages show recent or featured articles.
- Links use stable slugs.

Tasks:

- Add related article query.
- Add product article list.
- Add related block or sidebar.
- Add tags-based matching later.

## Epic 8: Media Management

### E8-S1: Supabase Storage Buckets

As the portal owner, I want media buckets organized so that diagrams and attachments are manageable.

Priority: P1

Acceptance criteria:

- Buckets exist for article media, diagrams, and downloads.
- Upload paths follow a predictable convention.
- Public access policy is decided and documented.

Tasks:

- Create buckets in Supabase.
- Decide public vs signed media access.
- Add storage policy SQL.
- Document naming convention.

### E8-S2: Admin Media Upload

As an editor, I want to upload media so that articles can include screenshots, diagrams, and downloadable references.

Priority: P1

Acceptance criteria:

- Admin can upload allowed media files.
- Upload creates `media_assets` row.
- Editor can select uploaded media in article blocks.
- File size/type errors are clear.

Tasks:

- Add upload component.
- Add server action/API for storage upload.
- Add media list picker.
- Add file validation.
- Add delete/archive later.

## Epic 9: Information Architecture And Content Quality

### E9-S1: Content Taxonomy

As the portal owner, I want a consistent taxonomy so that content stays navigable as it grows.

Priority: P1

Acceptance criteria:

- Products, categories, and tags have clear usage rules.
- Content types are documented.
- Slug conventions are documented.

Tasks:

- Create taxonomy guide in docs.
- Define initial categories.
- Define tag naming rules.
- Add content type descriptions.

### E9-S2: Content QA Checklist

As the portal owner, I want a publishing checklist so that public content is accurate and legally safe.

Priority: P1

Acceptance criteria:

- Checklist covers originality, source links, diagram source preservation, screenshots, secrets, and affiliation language.
- Editors can use checklist before publishing.

Tasks:

- Add checklist doc.
- Add checklist UI later.
- Add "last verified" field later.
- Add source/reference field later.

### E9-S3: First Real Content Set

As a public reader, I want useful initial content so that the portal is valuable at launch.

Priority: P1

Acceptance criteria:

- At least one real article exists for Documentum.
- At least one troubleshooting note exists.
- At least one diagram-backed architecture article exists.
- Product pages have non-placeholder summaries.

Tasks:

- Draft Documentum overview.
- Draft DQL basics note.
- Draft error-resolution template.
- Draft diagram practice guide.
- Review OpenText naming/disclaimer language.

## Epic 10: Deployment And Domain

### E10-S1: Vercel Deployment

As the portal owner, I want the app deployed on Vercel so that it can be publicly accessible.

Priority: P0

Acceptance criteria:

- Vercel imports GitHub repo.
- Build succeeds on Vercel.
- Production env vars are configured.
- Preview deployments work for PRs.

Tasks:

- Connect GitHub repo to Vercel.
- Set build command and framework defaults.
- Add env vars.
- Run first production deployment.
- Document deployment URL.

### E10-S2: Custom Domain Setup

As the portal owner, I want `extendedecm.com` connected so that readers use the final domain.

Priority: P0

Acceptance criteria:

- `extendedecm.com` points to Vercel.
- `www.extendedecm.com` redirects or resolves correctly.
- SSL certificate is active.
- DNS setup is documented.

Tasks:

- Add domain in Vercel.
- Update GoDaddy DNS records.
- Verify apex domain.
- Verify `www` domain.
- Document DNS records.

### E10-S3: Production Readiness Checks

As the portal owner, I want launch checks completed so that public release is controlled.

Priority: P0

Acceptance criteria:

- No secrets are committed.
- Build/lint/typecheck pass.
- Admin login is protected.
- Public pages render on production.
- Footer disclaimer appears.
- Domain and SSL are working.

Tasks:

- Run local verification.
- Run Vercel verification.
- Search repo for secret values.
- Test mobile layout.
- Test admin auth.

## Epic 11: Observability, Backup, And Operations

### E11-S1: Backup And Export Workflow

As the portal owner, I want a backup/export path so that content is not locked into Supabase.

Priority: P1

Acceptance criteria:

- Content can be exported to JSON.
- Media asset list can be exported.
- Export process is documented.

Tasks:

- Add export script.
- Add article JSON export.
- Add media manifest export.
- Document restore assumptions.
- Add scheduled backup later if needed.

### E11-S2: Analytics

As the portal owner, I want basic analytics so that I can understand content usage.

Priority: P2

Acceptance criteria:

- Analytics provider is selected.
- Public pages record page views.
- Analytics does not block rendering.
- Privacy implications are documented.

Tasks:

- Evaluate Vercel Analytics, Plausible, or Google Analytics.
- Add provider script/component.
- Verify production tracking.
- Add privacy note if needed.

### E11-S3: Sitemap And Robots

As a public reader, I want search engines to discover the content so that the portal is findable.

Priority: P1

Acceptance criteria:

- Sitemap includes public pages.
- Robots file allows public indexing.
- Draft/admin routes are not indexed.

Tasks:

- Add sitemap generator.
- Add robots route/file.
- Add metadata for public routes.
- Verify generated sitemap in production.

## Epic 12: Future Advanced Features

### E12-S1: Error Catalog

As a public reader, I want a searchable error catalog so that I can resolve known issues quickly.

Priority: P2

Acceptance criteria:

- Error entries have product, error code/string, symptoms, root cause, and resolution.
- Error entries can link to articles and snippets.
- Search can find exact error strings.

Tasks:

- Add error catalog schema.
- Add public error index.
- Add error detail page.
- Add admin editor.
- Add exact-string search support.

### E12-S2: DQL And Script Library

As a developer, I want a snippet library so that reusable DQL and scripts are easy to find.

Priority: P2

Acceptance criteria:

- Snippets have language/type, product, description, and code.
- Snippets can be copied.
- Snippets link to related articles.

Tasks:

- Add snippet schema.
- Add snippet renderer.
- Add copy button.
- Add admin editor.
- Add snippet filters.

### E12-S3: Learning Paths

As a learner, I want guided paths so that I can learn a product area in order.

Priority: P2

Acceptance criteria:

- Learning paths group articles in sequence.
- Path pages show progress structure.
- Paths can be product-specific.

Tasks:

- Add learning path schema.
- Add path detail page.
- Add ordered article picker.
- Add admin editor.

## Recommended Build Order

1. E1-S2: Commit and push scaffold.
2. E10-S1: Connect Vercel and confirm deployment.
3. E4-S1: Apply Supabase schema and create first owner profile.
4. E3-S1 and E3-S2: Verify admin login and protected dashboard.
5. E4-S2: Add database access layer.
6. E5-S1: Build admin article list.
7. E5-S2 and E5-S3: Build create/edit metadata flow.
8. E5-S4: Build block editor.
9. E5-S5: Build publish/unpublish.
10. E7-S1: Add Pagefind search.
11. E10-S2 and E10-S3: Connect domain and complete production checks.
12. E9-S3: Add first real launch content.
