# Supabase Setup Runbook

This runbook covers the first Supabase setup for the ExtendedECM Portal.

Project URL:

```text
https://cyhfxkrystsrvkwnomae.supabase.co
```

Do not commit database passwords, service role keys, JWT secrets, or connection strings.

## 1. Required Environment Variables

Local `.env.local`:

```text
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SITE_URL=http://localhost:3000
```

Vercel production and preview environments:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
SITE_URL
```

Rules:

- `NEXT_PUBLIC_*` values can be used by browser code.
- `SUPABASE_SERVICE_ROLE_KEY` must be used only in server-only modules/actions.
- The database password should not be needed by the deployed app.

## 2. Apply Database Schema

1. Open Supabase Dashboard.
2. Select the ExtendedECM project.
3. Go to SQL Editor.
4. Open [schema.sql](../supabase/schema.sql).
5. Paste the full SQL into the editor.
6. Review the SQL before running.
7. Run the SQL.

Expected result:

- Tables are created.
- RLS is enabled.
- Public read policies exist for published/public records.
- Editor policies are connected to `public.is_editor()`.

## 3. Create First Admin User

Use Supabase Dashboard:

1. Go to Authentication.
2. Create or invite the first admin user.
3. Confirm the user exists in `auth.users`.
4. Copy the user's UUID.

Then insert the owner profile from SQL Editor:

```sql
insert into public.profiles (id, email, display_name, role)
values (
  '<AUTH_USER_UUID>',
  '<ADMIN_EMAIL>',
  '<DISPLAY_NAME>',
  'owner'
)
on conflict (id) do update
set
  email = excluded.email,
  display_name = excluded.display_name,
  role = excluded.role,
  updated_at = now();
```

Verification:

```sql
select id, email, display_name, role, created_at, updated_at
from public.profiles
order by created_at desc;
```

## 4. Seed Initial Product Records

Run this after schema setup if product records should be available from Supabase.

```sql
insert into public.products (slug, name, summary, focus_areas, sort_order)
values
  (
    'documentum',
    'Documentum',
    'Repository, DFC, DQL, xCP, workflows, BOF/TBO/SBO customization, and operational troubleshooting.',
    array['Repository', 'DFC', 'DQL', 'xCP', 'Workflows', 'BOF/TBO/SBO'],
    10
  ),
  (
    'captiva',
    'Captiva',
    'Capture flows, classification, extraction, validation, export modules, and scan operations.',
    array['Capture', 'Classification', 'Extraction', 'Validation', 'Export'],
    20
  ),
  (
    'content-server',
    'OpenText Content Server',
    'Enterprise content management, workspace design, permissions, records, and integration patterns.',
    array['Workspaces', 'Permissions', 'Records', 'Search', 'Integrations'],
    30
  ),
  (
    'infoarchive',
    'InfoArchive',
    'Application retirement, archive ingestion, retention, query models, and compliance access.',
    array['Ingestion', 'Retention', 'Query', 'Compliance', 'Operations'],
    40
  ),
  (
    'xecm-engineering',
    'Extended ECM for Engineering',
    'Engineering document control, transmittals, CAD integrations, and project collaboration.',
    array['Document Control', 'Transmittals', 'CAD', 'Projects', 'Collaboration'],
    50
  ),
  (
    'vim',
    'Vendor Invoice Management',
    'Invoice capture, SAP integration, workflows, exceptions, approvals, and operational support.',
    array['SAP', 'Invoices', 'Approvals', 'Exceptions', 'Reporting'],
    60
  ),
  (
    'appworks',
    'AppWorks',
    'Low-code applications, entities, process models, integrations, and deployment practices.',
    array['Entities', 'Processes', 'Integrations', 'Deployment', 'Security'],
    70
  )
on conflict (slug) do update
set
  name = excluded.name,
  summary = excluded.summary,
  focus_areas = excluded.focus_areas,
  sort_order = excluded.sort_order,
  updated_at = now();
```

Verification:

```sql
select slug, name, sort_order
from public.products
order by sort_order;
```

## 5. Create Storage Buckets

Create these buckets in Supabase Storage:

```text
article-media
diagrams
downloads
```

Initial recommendation:

- `article-media`: public bucket for article images and screenshots.
- `diagrams`: public bucket for rendered diagrams and source files intended for public sharing.
- `downloads`: private bucket until a download publishing policy is implemented.

Keep editable source files when applicable:

- Mermaid source stored in article block JSON.
- `.drawio` source stored in `diagrams`.
- `.excalidraw` source stored in `diagrams`.
- PNG/SVG exports stored alongside source files.

Suggested object path format:

```text
<content-type>/<article-slug>/<filename>
```

Examples:

```text
articles/documentum-repository-basics/repository-access-flow.svg
articles/documentum-repository-basics/repository-access-flow.drawio
errors/session-exhaustion/first-failure-log.png
```

## 6. Storage Policies

Public media can use public buckets. For private buckets, add policies only when the upload manager is implemented.

Do not make admin upload policies broad until the admin role helper is verified.

Future private upload policy shape:

```sql
create policy "Editors can upload private downloads"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'downloads'
  and public.is_editor()
);
```

## 7. Verify RLS Behavior

Published public article should be readable:

```sql
select slug, title, status
from public.articles
where status = 'published';
```

Draft articles should not be readable by anonymous clients through Supabase APIs.

Editor check:

```sql
select public.is_editor();
```

When executed as the owner/editor user in an authenticated context, this should return `true`.

## 8. Local Auth Verification

After creating the first owner user:

1. Start the app.

   ```bash
   npm run dev
   ```

2. Open:

   ```text
   http://127.0.0.1:3000/admin/login
   ```

3. Sign in with the owner account.
4. Confirm redirect to:

   ```text
   /admin
   ```

## 9. Production Readiness Notes

Before production launch:

- Rotate any password or privileged key that was pasted into chat or logs.
- Add Vercel environment variables.
- Confirm `.env.local` remains ignored.
- Verify admin login on the production deployment.
- Verify public pages do not require Supabase admin credentials.
