-- =========================================
-- Blog Database Schema - Simplified
-- Run this in Supabase SQL Editor
-- =========================================

-- =========================================
-- 1. Shared trigger function: updated_at
-- =========================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- =========================================
-- 2. Posts table
-- =========================================
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  
  -- Core fields
  language text not null check (language in ('vi','en')),
  title text not null,
  slug text not null,
  excerpt text,
  content text not null,
  author text not null,
  featured_image text,
  
  -- Status & Scheduling
  status text default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  
  -- SEO (Basic)
  seo_title text,
  seo_description text,
  
  -- Metrics
  view_count bigint default 0,
  
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for posts
create unique index if not exists idx_posts_slug_language on posts(language, slug);
create index if not exists idx_posts_status on posts(status);
create index if not exists idx_posts_language on posts(language);
create index if not exists idx_posts_published_at on posts(published_at desc);

-- Trigger for updated_at
drop trigger if exists posts_updated_at on posts;
create trigger posts_updated_at
before update on posts
for each row execute function set_updated_at();

-- =========================================
-- 3. Tags table
-- =========================================
create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_vi text not null,
  name_en text not null,
  created_at timestamptz default now()
);

-- =========================================
-- 4. Post-Tags pivot table
-- =========================================
create table if not exists post_tags (
  post_id uuid references posts(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create index if not exists idx_post_tags_tag on post_tags(tag_id);

-- =========================================
-- 5. Comments table
-- =========================================
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  
  author_name text not null,
  author_email text not null,
  content text not null,
  
  status text default 'visible' check (status in ('visible','hidden')),
  
  created_at timestamptz default now()
);

create index if not exists idx_comments_post on comments(post_id);
create index if not exists idx_comments_status on comments(status);

-- =========================================
-- 6. URL Shortener Config table
-- =========================================
create table if not exists url_shortener_config (
  id uuid primary key default gen_random_uuid(),
  language text unique not null check (language in ('vi', 'en')),
  
  provider text not null,
  endpoint text not null,
  api_key text not null,
  http_method text default 'POST' check (http_method in ('GET','POST','PUT')),
  body_format text not null,
  
  is_active boolean default false,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger for updated_at
drop trigger if exists url_shortener_config_updated_at on url_shortener_config;
create trigger url_shortener_config_updated_at
before update on url_shortener_config
for each row execute function set_updated_at();

-- =========================================
-- 7. Shortened URLs table
-- =========================================
create table if not exists shortened_urls (
  id uuid primary key default gen_random_uuid(),
  
  original_url text not null,
  short_url text unique not null,
  short_code text unique,
  
  language text not null check (language in ('vi','en')),
  post_id uuid references posts(id) on delete set null,
  
  clicks integer default 0,
  
  created_at timestamptz default now()
);

create index if not exists idx_shortened_urls_post on shortened_urls(post_id);
create index if not exists idx_shortened_urls_language on shortened_urls(language);

-- =========================================
-- 8. URL Shortener Logs table
-- =========================================
create table if not exists url_shortener_logs (
  id uuid primary key default gen_random_uuid(),
  
  language text not null check (language in ('vi','en')),
  test_url text not null,
  short_url text,
  status text not null check (status in ('success', 'error')),
  error_message text,
  
  created_at timestamptz default now()
);

create index if not exists idx_url_shortener_logs_created_at on url_shortener_logs(created_at desc);
create index if not exists idx_url_shortener_logs_language on url_shortener_logs(language);

-- =========================================
-- 9. View: Published posts (public access)
-- =========================================
create or replace view public_posts as
select 
  id,
  language,
  title,
  slug,
  excerpt,
  content,
  author,
  featured_image,
  status,
  published_at,
  seo_title,
  seo_description,
  view_count,
  created_at,
  updated_at
from posts
where status = 'published'
  and published_at is not null
  and published_at <= now();

-- =========================================
-- 10. RLS Policies (Row Level Security)
-- =========================================

-- Enable RLS on all tables
alter table posts enable row level security;
alter table tags enable row level security;
alter table post_tags enable row level security;
alter table comments enable row level security;
alter table url_shortener_config enable row level security;
alter table shortened_urls enable row level security;
alter table url_shortener_logs enable row level security;

-- Public read access for published posts
create policy "Public can read published posts"
on posts for select
using (status = 'published' and published_at <= now());

-- Public read access for tags
create policy "Public can read tags"
on tags for select
using (true);

-- Public read access for post_tags
create policy "Public can read post_tags"
on post_tags for select
using (true);

-- Public can read visible comments
create policy "Public can read visible comments"
on comments for select
using (status = 'visible');

-- Public can insert comments
create policy "Public can insert comments"
on comments for insert
with check (true);

-- Public can read shortened_urls
create policy "Public can read shortened_urls"
on shortened_urls for select
using (true);

-- =========================================
-- 11. Helper function: Increment view count
-- =========================================
create or replace function increment_view_count(post_id uuid)
returns void as $$
begin
  update posts
  set view_count = view_count + 1
  where id = post_id;
end;
$$ language plpgsql security definer;

-- =========================================
-- 12. Helper function: Increment click count
-- =========================================
create or replace function increment_click_count(url_id uuid)
returns void as $$
begin
  update shortened_urls
  set clicks = clicks + 1
  where id = url_id;
end;
$$ language plpgsql security definer;
