-- Confere se a confirmação salva no navegador ainda existe na tabela.

create or replace function public.lookup_rsvp(p_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.rsvps;
  v_fallback text;
begin
  if p_id is null then
    return null;
  end if;

  select *
  into v_row
  from public.rsvps
  where id = p_id;

  if not found then
    return null;
  end if;

  select fallback_message
  into v_fallback
  from public.event_settings
  where id = 1;

  return jsonb_build_object(
    'id', v_row.id,
    'guest_name', v_row.guest_name,
    'diaper_size', v_row.diaper_size,
    'quota_fallback', v_row.quota_fallback,
    'fallback_message', case when v_row.quota_fallback then v_fallback else null end,
    'already_confirmed', true
  );
end;
$$;

revoke all on function public.lookup_rsvp(uuid) from public;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    grant execute on function public.lookup_rsvp(uuid) to anon;
  end if;

  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    grant execute on function public.lookup_rsvp(uuid) to authenticated;
  end if;

  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant execute on function public.lookup_rsvp(uuid) to service_role;
  end if;
end $$;
