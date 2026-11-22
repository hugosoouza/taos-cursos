-- Comandantes podem promover e remover outros comandantes pelo painel
grant select, insert, delete on public.admins to authenticated;
drop policy if exists admins_ver on public.admins;
drop policy if exists admins_gerir on public.admins;
drop policy if exists admins_inserir on public.admins;
drop policy if exists admins_remover on public.admins;
create policy admins_ver on public.admins for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
create policy admins_inserir on public.admins for insert to authenticated
  with check (public.is_admin());
-- ninguém remove a si mesmo (evita ficar sem comandante)
create policy admins_remover on public.admins for delete to authenticated
  using (public.is_admin() and user_id <> auth.uid());

select p.email, (a.user_id is not null) as comandante
from public.perfis p left join public.admins a on a.user_id = p.id;
