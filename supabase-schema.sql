-- ═══════════════════════════════════════════════════════════════
-- UBCAB Express — Supabase Schema
-- Supabase SQL Editor дээр энэ файлыг бүтнээр нь ажиллуулна уу
-- ═══════════════════════════════════════════════════════════════

-- 1. Жолоочийн бүртгэлийн хүсэлт
create table if not exists registrations (
  id          text primary key,
  name        text not null,
  phone       text not null,
  vehicle     text,
  district    text,
  email       text default '',
  method      text default 'phone',
  status      text default 'pending',  -- pending | approved | rejected
  _raw_pw     text,
  ts          text,
  created_at  timestamptz default now()
);

-- 2. Авсан / Цуцалсан буцаалтын дүн
create table if not exists return_results (
  id          uuid default gen_random_uuid() primary key,
  task_id     text,
  customer    text,
  district    text,
  items       text,
  status      text,   -- received | cancelled
  ubc_code    text,
  driver      text,
  ts          text,
  created_at  timestamptz default now()
);

-- 3. Жолоочийн хүсэлт (бараа шивүүлэх / цалин)
create table if not exists driver_requests (
  id          text primary key,
  driver      text,
  type        text,    -- goods | salary
  detail      text,
  status      text default 'new',  -- new | accountant | done
  ts          text,
  created_at  timestamptz default now()
);

-- 4. Жолоочийн notification-ууд
create table if not exists driver_notifs (
  id          uuid default gen_random_uuid() primary key,
  type        text,    -- salary | goods
  title       text,
  detail      text,
  ts          text,
  created_at  timestamptz default now()
);

-- 5. Excel-ээс оруулсан даалгаврууд
create table if not exists shipment_tasks (
  id          text primary key,
  tracking    text,
  phone       text,
  district    text,
  khoroo      text,
  addr        text,
  items       text,
  status      text default 'pending',
  weight      text,
  partner     text,
  created     text,
  created_at  timestamptz default now()
);

-- 6. CS Inbox шийдвэрлэсэн байдал (key-value)
create table if not exists cs_inbox_overrides (
  id          text primary key,
  status      text,
  updated_at  timestamptz default now()
);

-- ── Row Level Security (RLS) — нэвтрэлт шаардахгүй (demo) ───────
alter table registrations       enable row level security;
alter table return_results      enable row level security;
alter table driver_requests     enable row level security;
alter table driver_notifs       enable row level security;
alter table shipment_tasks      enable row level security;
alter table cs_inbox_overrides  enable row level security;

-- Бүх хүн унших, бичих боломжтой (demo — production дээр өөрчилнэ)
create policy "Public read"  on registrations       for select using (true);
create policy "Public write" on registrations       for all    using (true);
create policy "Public read"  on return_results      for select using (true);
create policy "Public write" on return_results      for all    using (true);
create policy "Public read"  on driver_requests     for select using (true);
create policy "Public write" on driver_requests     for all    using (true);
create policy "Public read"  on driver_notifs       for select using (true);
create policy "Public write" on driver_notifs       for all    using (true);
create policy "Public read"  on shipment_tasks      for select using (true);
create policy "Public write" on shipment_tasks      for all    using (true);
create policy "Public read"  on cs_inbox_overrides  for select using (true);
create policy "Public write" on cs_inbox_overrides  for all    using (true);
