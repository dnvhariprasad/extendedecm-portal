# ExtendedECM Portal - Agent Guide

## Project Goal

Build `extendedecm.com` as a public knowledge portal for OpenText Extended ECM ecosystem learning and reference material, including Documentum, Captiva, OpenText Content Server, InfoArchive, Extended ECM for Engineering, VIM, AppWorks, and related implementation/troubleshooting notes.

The portal should help the user's team learn concepts, preserve project notes, and quickly refer to architecture patterns, diagrams, commands, snippets, and error resolutions.

## Locked Technical Direction

Use a custom low-cost static-first stack:

- Frontend: Next.js + TypeScript
- UI: Tailwind CSS + shadcn/ui
- Hosting: Vercel Hobby initially
- Backend/database: Supabase Free initially
- Auth: Supabase Auth for admin access
- Storage: Supabase Storage initially
- Search: Pagefind static search index
- Diagrams: Mermaid, React Flow, Excalidraw or draw.io embeds
- Domain: `extendedecm.com`, registered at GoDaddy
- GitHub repo: `dnvhariprasad/extendedecm-portal`

## Content Scope

Initial portal areas should support:

- Products
- Articles
- Implementation guides
- Troubleshooting notes
- Error catalog entries
- DQL/script snippets
- Architecture patterns
- Learning paths
- Media and diagram assets

Recommended first database model:

- `profiles`
- `products`
- `articles`
- `article_blocks`
- `categories`
- `tags`
- `media_assets`
- `redirects`

## Block Editor Requirements

The custom CMS should provide WordPress-like reusable blocks, but store content in portable structured JSON where possible.

Important block types:

- Rich text
- Heading
- Image/media
- Architecture diagram
- Mermaid flowchart
- Mermaid sequence diagram
- React Flow visual map
- Excalidraw/draw.io embed or attachment
- Code snippet
- DQL/SQL snippet
- Error and resolution
- Warning/note/best practice
- Step-by-step procedure
- Comparison table
- FAQ
- Related articles

For diagrams, preserve source material where possible:

- Mermaid source text
- `.drawio` files
- `.excalidraw` JSON
- Rendered PNG/SVG exports

## Infrastructure Notes

Supabase project currently identified by:

- URL: `https://cyhfxkrystsrvkwnomae.supabase.co`
- Browser/public key should use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Never commit database passwords, service role keys, access tokens, or other secrets. Keep them only in local `.env` files and Vercel environment variables.

Recommended environment variable names:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SITE_URL`

Do not expose `SUPABASE_SERVICE_ROLE_KEY` to browser code.

## Security And Secret Handling

If a database password or privileged key appears in chat, terminal output, logs, or committed files, treat it as compromised and recommend rotating it before production use.

Admin access should be protected by Supabase Auth and an allowlist or role table. Public readers should not require login.

## Migration Philosophy

The portal may later move away from Supabase/Vercel or evolve into a different custom CMS. Keep content portable:

- Store page/article content as structured blocks.
- Avoid vendor-specific opaque markup for critical knowledge.
- Keep raw diagram sources with rendered diagrams.
- Keep slugs and URLs stable.
- Prefer explicit content types over unstructured blobs.

## Branding And Legal Notes

The site is an independent knowledge portal. It should not imply affiliation with OpenText.

Include a visible footer/disclaimer such as:

> This is an independent knowledge portal and is not affiliated with, endorsed by, or sponsored by OpenText.

Avoid copying official documentation verbatim. Write original notes and link to official sources when needed.

## Development Guidance

- Prefer simple, maintainable implementation over premature platform complexity.
- Use existing project patterns once the Next.js app is scaffolded.
- Keep public rendering static-first unless a feature truly requires runtime behavior.
- Keep admin-only Supabase access isolated from public rendering code.
- Add focused tests around content serialization, block rendering, auth gating, and static generation.
- Before committing, verify that no `.env` files or secrets are tracked.
