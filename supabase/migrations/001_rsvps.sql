-- Confirmações do chá de fraldas e atribuição de tamanho (1 pacote por família).
-- Metas para 50 confirmações: RN 8 (16%), P 12 (24%), M 18 (36%), G 12 (24%).
-- Se expected_rsvps mudar, as metas escalam na mesma proporção e o resto vai para M.

create table public.event_settings (
  id integer primary key check (id = 1),
  expected_rsvps integer not null default 50 check (expected_rsvps between 4 and 500),
  fallback_message text not null default 'Qualquer tamanho P ou M também ajuda, se o indicado estiver difícil de encontrar.'
);

insert into public.event_settings (id) values (1);

create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  guest_name text not null,
  phone text not null,
  email text,
  adults_count integer not null default 1 check (adults_count between 1 and 10),
  notes text,
  diaper_size text not null check (diaper_size in ('RN', 'P', 'M', 'G')),
  quota_fallback boolean not null default false,
  status text not null default 'confirmed'
);

comment on table public.rsvps is
  'Confirmações do chá. diaper_size é 1 pacote por família, mesmo com adults_count > 1.';

create unique index rsvps_name_phone_unique
  on public.rsvps (lower(guest_name), phone);

alter table public.rsvps enable row level security;
alter table public.event_settings enable row level security;

revoke all on table public.rsvps from public;
revoke all on table public.event_settings from public;

create or replace function public.assign_and_insert_rsvp(
  p_guest_name text,
  p_phone text,
  p_email text default null,
  p_adults_count integer default 1,
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
  v_phone text;
  v_email text;
  v_notes text;
  v_expected integer;
  v_fallback text;
  v_rn integer;
  v_p integer;
  v_m integer;
  v_g integer;
  v_size text;
  v_deficit integer;
  v_row public.rsvps;
begin
  v_name := regexp_replace(trim(coalesce(p_guest_name, '')), '\s+', ' ', 'g');
  v_phone := regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
  v_email := nullif(trim(coalesce(p_email, '')), '');
  v_notes := nullif(trim(coalesce(p_notes, '')), '');

  if char_length(v_name) < 3 or char_length(v_name) > 120 then
    raise exception 'invalid_name';
  end if;

  if char_length(v_phone) < 10 or char_length(v_phone) > 13 then
    raise exception 'invalid_phone';
  end if;

  if v_email is not null and v_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'invalid_email';
  end if;

  if v_email is not null and char_length(v_email) > 160 then
    raise exception 'invalid_email';
  end if;

  -- O formulário público aceita de 1 a 6. A coluna permite até 10 para ajuste manual.
  if p_adults_count is null or p_adults_count < 1 or p_adults_count > 6 then
    raise exception 'invalid_adults';
  end if;

  if v_notes is not null and char_length(v_notes) > 500 then
    raise exception 'invalid_notes';
  end if;

  perform pg_advisory_xact_lock(872431);

  select expected_rsvps, fallback_message
  into v_expected, v_fallback
  from public.event_settings
  where id = 1;

  v_rn := round(v_expected * 0.16)::integer;
  v_p := round(v_expected * 0.24)::integer;
  v_g := round(v_expected * 0.24)::integer;
  v_m := v_expected - v_rn - v_p - v_g;

  if v_m < 1 then
    v_m := 1;
  end if;

  select picked.size, picked.deficit
  into v_size, v_deficit
  from (
    select
      t.size,
      t.target - coalesce(c.n, 0) as deficit,
      t.priority
    from (
      values
        ('RN'::text, v_rn, 4),
        ('P', v_p, 3),
        ('M', v_m, 1),
        ('G', v_g, 2)
    ) as t(size, target, priority)
    left join (
      select diaper_size, count(*)::integer as n
      from public.rsvps
      group by diaper_size
    ) as c on c.diaper_size = t.size
  ) as picked
  order by picked.deficit desc, picked.priority asc
  limit 1;

  begin
    insert into public.rsvps (
      guest_name,
      phone,
      email,
      adults_count,
      notes,
      diaper_size,
      quota_fallback
    )
    values (
      v_name,
      v_phone,
      v_email,
      p_adults_count,
      v_notes,
      v_size,
      v_deficit <= 0
    )
    returning * into v_row;
  exception
    when unique_violation then
      raise exception 'duplicate_rsvp';
  end;

  return jsonb_build_object(
    'id', v_row.id,
    'guest_name', v_row.guest_name,
    'diaper_size', v_row.diaper_size,
    'quota_fallback', v_row.quota_fallback,
    'fallback_message', case when v_row.quota_fallback then v_fallback else null end
  );
end;
$$;

revoke all on function public.assign_and_insert_rsvp(text, text, text, integer, text) from public;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    grant execute on function public.assign_and_insert_rsvp(text, text, text, integer, text) to anon;
  end if;

  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    grant execute on function public.assign_and_insert_rsvp(text, text, text, integer, text) to authenticated;
  end if;

  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant all on table public.rsvps to service_role;
    grant all on table public.event_settings to service_role;
    grant execute on function public.assign_and_insert_rsvp(text, text, text, integer, text) to service_role;
  end if;
end $$;
