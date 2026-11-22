-- =====================================================================
-- TAOS Militar · banco de dados (Supabase, plano gratuito)
-- Rode este arquivo inteiro uma vez no SQL Editor do projeto.
-- Pode rodar de novo sem problema: ele não apaga dados.
-- =====================================================================

-- Perfil de cada aluno (criado automaticamente quando a conta é criada)
create table if not exists public.perfis (
  id        uuid primary key references auth.users(id) on delete cascade,
  email     text,
  nome      text,
  telefone  text,
  criado    timestamptz not null default now()
);

-- Quem pode usar o Painel do comandante
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- Quais mentorias cada aluno comprou (pmdf, pmgo, pcto, pcmg)
create table if not exists public.matriculas (
  user_id  uuid not null references auth.users(id) on delete cascade,
  curso_id text not null check (curso_id ~ '^[a-z0-9-]{2,20}$'),
  ativo    boolean not null default true,
  criado   timestamptz not null default now(),
  primary key (user_id, curso_id)
);

-- Progresso de estudo: uma linha por aluno e por curso
create table if not exists public.progresso (
  user_id    uuid not null references auth.users(id) on delete cascade,
  curso_id   text not null,
  dados      jsonb not null default '{}'::jsonb,
  atualizado timestamptz not null default now(),
  primary key (user_id, curso_id)
);

-- É comandante?
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Tem matrícula ativa neste curso?
create or replace function public.tem_matricula(c text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.matriculas where user_id = auth.uid() and curso_id = c and ativo);
$$;

-- Cria o perfil quando uma conta nova aparece
create or replace function public.novo_perfil()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.perfis (id, email, nome, telefone)
  values (new.id, new.email, new.raw_user_meta_data->>'nome', new.raw_user_meta_data->>'telefone')
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists taos_novo_perfil on auth.users;
create trigger taos_novo_perfil after insert on auth.users
  for each row execute function public.novo_perfil();

-- Perfis de contas que já existiam
insert into public.perfis (id, email, nome)
select id, email, raw_user_meta_data->>'nome' from auth.users
on conflict (id) do nothing;

-- ---------------- Regras de acesso (RLS) ----------------
alter table public.perfis     enable row level security;
alter table public.admins     enable row level security;
alter table public.matriculas enable row level security;
alter table public.progresso  enable row level security;

drop policy if exists perfis_ver      on public.perfis;
drop policy if exists perfis_editar   on public.perfis;
drop policy if exists admins_ver      on public.admins;
drop policy if exists mat_ver         on public.matriculas;
drop policy if exists mat_admin       on public.matriculas;
drop policy if exists prog_ver        on public.progresso;
drop policy if exists prog_inserir    on public.progresso;
drop policy if exists prog_atualizar  on public.progresso;

-- Aluno vê o próprio perfil; comandante vê todos
create policy perfis_ver on public.perfis for select to authenticated
  using (id = auth.uid() or public.is_admin());
create policy perfis_editar on public.perfis for update to authenticated
  using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

create policy admins_ver on public.admins for select to authenticated
  using (user_id = auth.uid());

-- Aluno vê só as próprias matrículas; só o comandante cria, muda ou apaga
create policy mat_ver on public.matriculas for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
create policy mat_admin on public.matriculas for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Progresso: só o dono, e só nos cursos que ele comprou
create policy prog_ver on public.progresso for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
create policy prog_inserir on public.progresso for insert to authenticated
  with check (user_id = auth.uid() and (public.tem_matricula(curso_id) or public.is_admin()));
create policy prog_atualizar on public.progresso for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid() and (public.tem_matricula(curso_id) or public.is_admin()));

-- ---------------- Primeiro comandante ----------------
-- Depois de criar a SUA conta (Authentication → Users → Add user),
-- troque o e-mail abaixo pelo seu e rode só esta linha:
-- insert into public.admins (user_id) select id from auth.users where email = 'SEU-EMAIL@gmail.com';
