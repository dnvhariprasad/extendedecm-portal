# Product Requirements Document: ExtendedECM Knowledge Portal

## 1. Overview

ExtendedECM Knowledge Portal is a public, independent learning and reference portal for the OpenText Extended ECM ecosystem. It will organize practical implementation knowledge, architecture notes, troubleshooting guidance, diagrams, code snippets, and project learnings for products such as Documentum, Captiva, OpenText Content Server, InfoArchive, Extended ECM for Engineering, Vendor Invoice Management, and AppWorks.

The portal must serve two audiences:

- Public readers who want structured learning and reference material.
- Internal/team editors who need a simple CMS-style authoring interface for maintaining content.

## 2. Problem Statement

Enterprise content management knowledge is often scattered across project notes, old troubleshooting chats, PDFs, vendor documentation, code snippets, diagrams, and team memory. This makes onboarding slower and causes repeated investigation for known implementation patterns and errors.

The portal should convert those learnings into a searchable, structured, diagram-friendly knowledge base that can be used during project delivery.

## 3. Goals

- Provide a public knowledge portal at `extendedecm.com`.
- Organize content by product, topic, implementation pattern, and troubleshooting category.
- Support visual learning through diagrams, flowcharts, sequence diagrams, visual blocks, and structured callouts.
- Provide a custom admin/CMS area for creating and editing content.
- Store content in portable structured blocks so future migration remains feasible.
- Keep the initial infrastructure simple using Vercel and Supabase.
- Avoid dependency on proprietary CMS-specific markup for critical knowledge.
- Include clear independent-site branding and OpenText non-affiliation disclaimer.

## 4. Non-Goals

- Do not build a generic blogging platform.
- Do not copy official OpenText documentation verbatim.
- Do not implement paid courses, subscriptions, or gated public content in the first release.
- Do not implement complex workflow approvals in the first release.
- Do not build a full WordPress-equivalent page builder in the first release.
- Do not expose Supabase service role keys or privileged credentials to browser code.

## 5. Target Users

### 5.1 Public Reader

Readers may be consultants, developers, administrators, architects, or learners working around the Extended ECM ecosystem.

Primary needs:

- Understand product concepts quickly.
- Refer to architecture patterns and diagrams.
- Search for errors, DQL snippets, and implementation notes.
- Navigate between related topics.

### 5.2 Team Editor

Editors are trusted team members who maintain portal content.

Primary needs:

- Sign in securely.
- Create and edit structured content.
- Add diagrams, source files, snippets, notes, and references.
- Preserve reusable project learnings.

### 5.3 Portal Owner

The owner manages publishing direction, security, content quality, and infrastructure.

Primary needs:

- Keep operational maintenance low.
- Control admin access.
- Ensure content is portable.
- Deploy safely to production.

## 6. Product Scope

### 6.1 Initial Product Areas

The portal must support these product sections:

- Documentum
- Captiva
- OpenText Content Server
- InfoArchive
- Extended ECM for Engineering
- Vendor Invoice Management
- AppWorks

Each product area should eventually contain:

- Overview
- Architecture notes
- Implementation guides
- Troubleshooting notes
- Common errors
- Query/script snippets
- Related diagrams
- Learning path references

### 6.2 Content Types

The first release should support:

- Product
- Article
- Implementation guide
- Troubleshooting note
- Error catalog entry
- DQL/script snippet
- Architecture pattern
- Learning path
- Media asset

### 6.3 Content Blocks

Articles should be composed from reusable structured blocks.

Required first-release blocks:

- Heading
- Rich text
- Note / warning / best practice
- Code snippet (DQL/SQL/script handled by the same block via the `language` field; split into a dedicated DQL block only if syntax-aware behavior is later required)
- Mermaid diagram
- Step-by-step procedure

Planned later blocks:

- React Flow architecture map
- Draw.io attachment/embed
- Excalidraw attachment/embed
- Product comparison table
- Error-resolution card
- FAQ block
- Related article block
- Download/attachment block

## 7. Functional Requirements

### 7.1 Public Portal

- The homepage must explain the portal purpose and surface key product areas.
- Product index must list supported Extended ECM ecosystem products.
- Product detail pages must summarize each product and show focus areas.
- Article pages must render structured blocks cleanly.
- Public pages must include the non-affiliation disclaimer.
- Public content should be SEO-friendly with page titles and descriptions.
- URLs should be human-readable and stable.

### 7.2 Admin Authentication And Authorization

- Admin area must be available at `/admin`.
- Login page must be available at `/admin/login`.
- Authentication must use Supabase Auth (email/password is the first-release method; magic link evaluated post-MVP).
- Unauthenticated users must be redirected away from protected admin pages.
- Authorization uses owner/editor/viewer roles, modeled by `profiles.role` and the `public.is_editor()` security-definer helper in `supabase/schema.sql`. RLS policies for editor writes are already in place.
- Admin UI must consult `is_editor()` (or an equivalent server-side helper) before exposing write actions; viewer-role users must see read-only states rather than failed mutations.

### 7.3 Content Management

- Editors must be able to create and edit article content through the CMS interface.
- Articles must store content as structured block data.
- Articles must support draft, published, and archived states.
- Articles must support product/category/tag relationships.
- Content should preserve raw diagram source where possible.
- Article inserts must populate `created_by` with the acting user; updates must refresh `updated_by`. Both columns reference `auth.users(id)` and must never be left null on writes performed through the admin UI.

### 7.4 Diagram Handling

- Mermaid diagrams must render on public article pages.
- Mermaid source must remain accessible and portable.
- Future draw.io and Excalidraw support must preserve original source files.
- Rendered diagrams should not be the only source of knowledge.

### 7.5 Search

- First search implementation should use Pagefind.
- Search should index public static pages.
- Search should support article titles, excerpts, product names, and body content.
- Hosted search products such as Algolia, Typesense, or Meilisearch may be evaluated later if content volume grows.

Implementation note: Pagefind requires rendered HTML on disk. Local verification showed that the current `npm run search:index` command can index generated HTML under `.next/server/app`. E7-S1 must harden this for production by confirming the same artifact path exists in Vercel builds, excluding admin/private routes, and documenting the final indexing command.

If the Vercel build artifact path is not stable enough for Pagefind, use a post-deploy crawl of the deployed public site instead of switching the entire app to static export.

### 7.6 Media

- Media should initially use Supabase Storage.
- Media records should track bucket, path, filename, MIME type, file size, and source kind.
- Source diagram files should be stored alongside rendered exports where applicable.

### 7.7 Migration And Export

- Content should be exportable from Supabase as structured data.
- Blocks should use explicit `type` fields and predictable JSON schemas.
- Slugs should remain stable for future migration.
- Avoid opaque plugin-specific markup as the primary content source.

## 8. Non-Functional Requirements

### 8.1 Performance

- Public pages should load quickly on desktop and mobile.
- Static generation should be preferred for public pages where practical.
- Diagrams must not cause layout overlap or unreadable mobile rendering.

### 8.2 Security

- Service role keys must never be exposed to client-side code.
- `.env.local` and other secret files must never be committed.
- Admin routes must require authentication.
- Database RLS policies must protect draft/editor-only data.
- If any privileged secret appears in logs, commits, or chat, rotate it before production.

### 8.3 Reliability

- The application should build cleanly on Vercel.
- Public routes should not depend on editor-only credentials.
- Schema changes should be tracked in `supabase/`.

### 8.4 Accessibility

- Navigation must be keyboard accessible.
- Buttons and links must have clear labels.
- Text contrast must be readable.
- Diagrams must include a visible title rendered alongside the diagram and an accessible name on the rendered SVG (e.g. `aria-label` or `<title>`).
- Mermaid blocks must keep the source text reachable for users — either always visible, or inside a keyboard-operable disclosure — so a render failure or assistive-tech scenario never leaves the diagram opaque.

### 8.5 Legal And Branding

- The site must clearly state that it is independent.
- Use a footer disclaimer:

  > This is an independent knowledge portal and is not affiliated with, endorsed by, or sponsored by OpenText.

- OpenText product names may be referenced for educational and descriptive purposes, but content must be original.

## 9. Technical Architecture

### 9.1 Locked Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn-style components
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Vercel
- Pagefind
- Mermaid

React Flow is planned for a later block type (§6.3) and will be added as a dependency when that block lands; it is not part of the locked first-release stack.

### 9.2 Repository

GitHub repository:

```text
dnvhariprasad/extendedecm-portal
```

### 9.3 Environment Variables

Required variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
SITE_URL
```

Rules:

- `NEXT_PUBLIC_*` values may be used in browser code.
- `SUPABASE_SERVICE_ROLE_KEY` must only be used server-side.
- Database passwords must not be stored in the repo.

## 10. Data Model

Initial database objects:

- `profiles`
- `products`
- `categories`
- `tags`
- `articles`
- `article_tags`
- `media_assets`
- `redirects`

Article core fields:

- `id`
- `product_id`
- `category_id`
- `slug`
- `title`
- `excerpt`
- `content_type`
- `status`
- `blocks`
- `featured`
- `published_at`
- `created_by`
- `updated_by`
- `created_at`
- `updated_at`

Block data must be JSON and include:

- `id`
- `type`
- block-specific payload

Example:

```json
{
  "id": "repository-flow",
  "type": "mermaid",
  "title": "Repository Access Flow",
  "source": "sequenceDiagram..."
}
```

## 11. MVP Requirements

The MVP is complete when:

- Public homepage is available.
- Product index and product detail pages are available.
- Article detail page renders sample structured blocks.
- Mermaid block renders a diagram and exposes source.
- Admin login works with Supabase Auth.
- Admin dashboard is protected.
- Initial Supabase schema is available.
- Vercel deployment can be configured.
- Non-affiliation disclaimer is rendered in the footer on every public page.
- Public pages have per-route `<title>` and meta description.
- `sitemap.xml` and `robots.txt` are served, listing public routes only and excluding `/admin`.
- No secrets are committed.

## 12. Post-MVP Roadmap

### Phase 2: Real CMS Editing

- Article list in admin
- Create/edit article form
- Block add/remove/reorder UI
- Save drafts to Supabase
- Publish/unpublish flow
- Product/category/tag management

### Phase 3: Rich Knowledge Features

- Error catalog UI
- DQL/script snippet library
- Learning path builder
- Related article suggestions
- Media upload manager
- Draw.io and Excalidraw source preservation

### Phase 4: Search And Discovery

- Pagefind integration
- Search page and search modal
- Product/topic filters
- Popular content and recently updated content

### Phase 5: Production Hardening

- Role-based admin authorization wired into UI gating (schema-level roles already exist)
- Backup/export workflow
- Vercel production deployment
- Domain setup for `extendedecm.com`
- Analytics
- Content QA checklist

## 13. Success Metrics

Initial success should be measured by:

- Number of useful product pages created.
- Number of implementation notes added.
- Number of troubleshooting/error entries added.
- Team usage during project delivery.
- Search success for known topics/errors.
- Reduction in repeated explanation or investigation for known issues.

Public growth metrics may later include:

- Organic search impressions.
- Page views by product area.
- Average search queries.
- Returning visitors.
- External references or shares.

Each metric needs a recorded source (e.g. Pagefind log, analytics provider, manual content audit) and review cadence before it can be tracked. Defer concrete targets until baseline numbers exist.

## 14. Open Questions

Resolved:

- Auth method: email/password is the first-release method (shipped via EXCM-003). Magic link deferred post-MVP.

Open and blocking:

- Who are the first admin/editor users (names + email addresses for `profiles` seeding)?

Open and non-blocking:

- Public rendering and indexing model for search — continue with the current Supabase-backed App Router approach unless Pagefind production verification fails, then evaluate a post-deploy crawl.
- Should media uploads be public by default or signed/private until published?
- Which product section should be built first with real content?
- What is the preferred visual style for architecture diagrams: Mermaid-first, draw.io-first, or custom React Flow-first?

## 15. Current Implementation Status

Shipped on `main`:

- Next.js app shell, public homepage, product routes, article route.
- Admin route protected by Supabase Auth; admin login route; sign-out server action; authenticated admin shell (EXCM-003).
- Server and browser Supabase client helpers (`@supabase/ssr`).
- Public Supabase data access layer for products and published articles, with scaffold sample-content fallback while Supabase setup is incomplete (EXCM-004).
- Block renderer for heading / rich-text / note / code / mermaid / steps; client-only Mermaid block.
- Initial Supabase schema with RLS, `is_editor()` helper, and editor-write policies.
- `docs/SUPABASE_SETUP.md` runbook for applying schema, seeding the first owner, and creating storage buckets (EXCM-002).
- CI workflow running lint, typecheck, and build on Node 22.
- Admin article list with setup, empty, and table states (EXCM-005).
- Admin article creation flow for metadata and initial draft/published records (EXCM-006).
- Admin article metadata editing flow for title, slug, excerpt, product, content type, and status (EXCM-007).

In flight:

- No active implementation branch is currently in flight.

Next recommended implementation step:

Address the latest code-review findings, especially rich-text sanitization and production sample-content fallback, then continue with `EXCM-008` for block add/edit/reorder/remove.
