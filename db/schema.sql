-- ─────────────────────────────────────────────────────────────────────────────
-- SOMIL Dental Products · Supabase (PostgreSQL) schema — PHASE 2, not yet wired to the app.
--
-- The storefront is fully functional without a database: the catalogue is
-- static and orders travel over WhatsApp. This schema is here for the moment
-- product management moves server-side (Supabase) and the backend API is
-- hosted on Neon.
--
-- Run in the Supabase SQL editor. Never expose the service-role key to the
-- browser; the anon key plus RLS is the only client-side access path.
-- ─────────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- ── catalogue ────────────────────────────────────────────────────────────────

create table if not exists categories (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         text not null,
  short_name   text not null,
  blurb        text,
  description  text,
  position     int  not null default 0,
  created_at   timestamptz not null default now()
);

create table if not exists products (
  id                 uuid primary key default gen_random_uuid(),
  slug               text unique not null,
  name               text not null,
  subtitle           text,
  category_id        uuid references categories(id) on delete set null,
  price_paise        int  not null check (price_paise >= 0),
  compare_at_paise   int  check (compare_at_paise is null or compare_at_paise >= price_paise),
  size               text,
  short_description  text,
  description        text,
  highlights         jsonb not null default '[]'::jsonb,
  specs              jsonb not null default '[]'::jsonb,
  images             jsonb not null default '[]'::jsonb,
  stock              int  not null default 0 check (stock >= 0),
  rating             numeric(2,1) not null default 0,
  review_count       int  not null default 0,
  badge              text,
  featured           boolean not null default false,
  popular            boolean not null default false,
  active             boolean not null default true,
  search_text        text generated always as (
                       coalesce(name,'') || ' ' || coalesce(subtitle,'') || ' ' ||
                       coalesce(short_description,'')
                     ) stored,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists products_category_idx on products(category_id);
create index if not exists products_active_idx   on products(active) where active;
create index if not exists products_search_idx   on products using gin (to_tsvector('english', search_text));

-- ── orders (created from the WhatsApp hand-off) ──────────────────────────────

create table if not exists orders (
  id                uuid primary key default gen_random_uuid(),
  reference         text unique not null,
  customer_name     text not null,
  customer_phone    text not null,
  customer_email    text,
  address_line      text not null,
  city              text not null,
  state             text not null,
  pincode           text not null,
  notes             text,
  subtotal_paise    int  not null default 0,
  shipping_paise    int  not null default 0,
  total_paise       int  not null default 0,
  status            text not null default 'pending'
                    check (status in ('pending','confirmed','dispatched','delivered','cancelled')),
  whatsapp_sent_at  timestamptz,
  created_at        timestamptz not null default now()
);

create table if not exists order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references orders(id) on delete cascade,
  product_id    uuid references products(id) on delete set null,
  name_snapshot text not null,
  size_snapshot text,
  unit_paise    int  not null,
  qty           int  not null check (qty > 0),
  line_paise    int  not null
);

create index if not exists order_items_order_idx on order_items(order_id);

-- ── row level security ───────────────────────────────────────────────────────
-- The public site may read the catalogue; nothing else is client-writable.

alter table categories  enable row level security;
alter table products    enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;

drop policy if exists "public read categories" on categories;
create policy "public read categories" on categories for select using (true);

drop policy if exists "public read active products" on products;
create policy "public read active products" on products for select using (active);

-- orders and order_items: no public policies. Service-role only.
