-- Tamanhos só P, M e G. Para 50 famílias: P 14 (28%), M 22 (44%), G 14 (28%).
-- Confirmação repetida devolve o tamanho já atribuído, sem nova linha.

do $$
declare
  r record;
  v_expected integer;
  v_p integer;
  v_m integer;
  v_g integer;
  v_size text;
  v_constraint text;
begin
  select expected_rsvps into v_expected from public.event_settings where id = 1;

  for r in
    select id from public.rsvps where diaper_size = 'RN' order by created_at
  loop
    v_p := round(v_expected * 0.28)::integer;
    v_g := round(v_expected * 0.28)::integer;
    v_m := v_expected - v_p - v_g;
    if v_m < 1 then
      v_m := 1;
    end if;

    select picked.size
    into v_size
    from (
      select
        t.size,
        t.target - coalesce(c.n, 0) as deficit,
        t.priority
      from (
        values
          ('P'::text, v_p, 3),
          ('M', v_m, 1),
          ('G', v_g, 2)
      ) as t(size, target, priority)
      left join (
        select diaper_size, count(*)::integer as n
        from public.rsvps
        where diaper_size in ('P', 'M', 'G')
        group by diaper_size
      ) as c on c.diaper_size = t.size
    ) as picked
    order by picked.deficit desc, picked.priority asc
    limit 1;

    update public.rsvps set diaper_size = v_size where id = r.id;
  end loop;

  select con.conname
  into v_constraint
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  join pg_namespace nsp on nsp.oid = rel.relnamespace
  where nsp.nspname = 'public'
    and rel.relname = 'rsvps'
    and con.contype = 'c'
    and pg_get_constraintdef(con.oid) ilike '%diaper_size%';

  if v_constraint is not null then
    execute format('alter table public.rsvps drop constraint %I', v_constraint);
  end if;
end $$;

alter table public.rsvps
  add constraint rsvps_diaper_size_check check (diaper_size in ('P', 'M', 'G'));

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
  v_notes text;
  v_expected integer;
  v_fallback text;
  v_p integer;
  v_m integer;
  v_g integer;
  v_size text;
  v_deficit integer;
  v_row public.rsvps;
begin
  v_name := regexp_replace(trim(coalesce(p_guest_name, '')), '\s+', ' ', 'g');
  v_phone := regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
  v_notes := nullif(trim(coalesce(p_notes, '')), '');

  if char_length(v_name) < 3 or char_length(v_name) > 120 then
    raise exception 'invalid_name';
  end if;

  if char_length(v_phone) < 10 or char_length(v_phone) > 13 then
    raise exception 'invalid_phone';
  end if;

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

  v_p := round(v_expected * 0.28)::integer;
  v_g := round(v_expected * 0.28)::integer;
  v_m := v_expected - v_p - v_g;

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
        ('P'::text, v_p, 3),
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
      null,
      p_adults_count,
      v_notes,
      v_size,
      v_deficit <= 0
    )
    returning * into v_row;
  exception
    when unique_violation then
      select *
      into v_row
      from public.rsvps
      where lower(guest_name) = lower(v_name)
        and phone = v_phone;

      if not found then
        raise exception 'duplicate_rsvp';
      end if;

      return jsonb_build_object(
        'id', v_row.id,
        'guest_name', v_row.guest_name,
        'diaper_size', v_row.diaper_size,
        'quota_fallback', v_row.quota_fallback,
        'fallback_message', case when v_row.quota_fallback then v_fallback else null end,
        'already_confirmed', true
      );
  end;

  return jsonb_build_object(
    'id', v_row.id,
    'guest_name', v_row.guest_name,
    'diaper_size', v_row.diaper_size,
    'quota_fallback', v_row.quota_fallback,
    'fallback_message', case when v_row.quota_fallback then v_fallback else null end,
    'already_confirmed', false
  );
end;
$$;
