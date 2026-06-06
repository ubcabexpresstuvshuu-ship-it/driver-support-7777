create table if not exists public.ubcab_records (
  collection text not null,
  record_id text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (collection, record_id)
);

alter table public.ubcab_records enable row level security;

drop policy if exists "Allow public realtime read" on public.ubcab_records;
create policy "Allow public realtime read"
on public.ubcab_records
for select
to anon
using (true);

drop policy if exists "Allow public realtime insert" on public.ubcab_records;
create policy "Allow public realtime insert"
on public.ubcab_records
for insert
to anon
with check (true);

drop policy if exists "Allow public realtime update" on public.ubcab_records;
create policy "Allow public realtime update"
on public.ubcab_records
for update
to anon
using (true)
with check (true);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'ubcab_records'
  ) then
    alter publication supabase_realtime add table public.ubcab_records;
  end if;
end $$;
