-- ExtendedECM Portal initial schema
-- Run this in Supabase SQL Editor after reviewing policies for your team.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  role text not null default 'viewer' check (role in ('owner', 'editor', 'viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  summary text not null,
  focus_areas text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content_type text not null default 'learning_note' check (
    content_type in (
      'implementation_guide',
      'architecture_pattern',
      'troubleshooting_note',
      'learning_note',
      'dql_snippet'
    )
  ),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  blocks jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.article_tags (
  article_id uuid not null references public.articles(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  path text not null,
  filename text not null,
  mime_type text,
  size_bytes bigint,
  source_kind text check (source_kind in ('rendered', 'mermaid', 'drawio', 'excalidraw', 'download')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (bucket, path)
);

create table if not exists public.redirects (
  id uuid primary key default gen_random_uuid(),
  source_path text not null unique,
  target_path text not null,
  status_code integer not null default 301 check (status_code in (301, 302, 307, 308)),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.articles enable row level security;
alter table public.article_tags enable row level security;
alter table public.media_assets enable row level security;
alter table public.redirects enable row level security;

create or replace function public.is_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('owner', 'editor')
  );
$$;

create policy "Published articles are publicly readable"
on public.articles for select
using (status = 'published' or public.is_editor());

create policy "Products are publicly readable"
on public.products for select
using (true);

create policy "Categories are publicly readable"
on public.categories for select
using (true);

create policy "Tags are publicly readable"
on public.tags for select
using (true);

create policy "Article tags are publicly readable"
on public.article_tags for select
using (true);

create policy "Redirects are publicly readable"
on public.redirects for select
using (true);

create policy "Media records are publicly readable"
on public.media_assets for select
using (true);

create policy "Profiles are self readable"
on public.profiles for select
using (id = auth.uid() or public.is_editor());

create policy "Editors can manage products"
on public.products for all
using (public.is_editor())
with check (public.is_editor());

create policy "Editors can manage categories"
on public.categories for all
using (public.is_editor())
with check (public.is_editor());

create policy "Editors can manage tags"
on public.tags for all
using (public.is_editor())
with check (public.is_editor());

create policy "Editors can manage articles"
on public.articles for all
using (public.is_editor())
with check (public.is_editor());

create policy "Editors can manage article tags"
on public.article_tags for all
using (public.is_editor())
with check (public.is_editor());

create policy "Editors can manage media records"
on public.media_assets for all
using (public.is_editor())
with check (public.is_editor());

create policy "Editors can manage redirects"
on public.redirects for all
using (public.is_editor())
with check (public.is_editor());

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger articles_set_updated_at
before update on public.articles
for each row execute function public.set_updated_at();
