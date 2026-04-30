# ExtendedECM Portal

Public knowledge portal for OpenText Extended ECM ecosystem learning and project reference.

## Stack

- Next.js + TypeScript
- Tailwind CSS + shadcn-style components
- Supabase Auth, PostgreSQL, and Storage
- Vercel hosting
- Pagefind static search
- Mermaid and source-preserving diagram blocks

## Local Setup

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill the Supabase values. Do not commit secrets.

## Initial Routes

- `/` - public portal landing page
- `/products` - product index
- `/products/[slug]` - product overview
- `/articles/[slug]` - article rendering with block support
- `/admin` - protected CMS dashboard shell
- `/admin/login` - Supabase login page

## Database

Start with `supabase/schema.sql` for the first-pass content model.
