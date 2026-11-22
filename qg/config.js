/* Conexão com o banco de dados (Supabase) do TAOS Militar.
   Vazio = MODO DEMONSTRAÇÃO: sem login, todos os cursos abertos e o progresso fica só no navegador.
   A chave "publishable" (ou "anon") é pública e pode ficar aqui: quem protege os dados são as
   regras de acesso (RLS) do banco. NUNCA coloque aqui a "secret" / "service_role" key. */
window.QG_CONFIG = {
  supabaseUrl: 'https://zdcmmhvpoaiizpihpadj.supabase.co',
  supabaseKey: 'sb_publishable_P9gZeBr476Kpck9woZWF6w_SMD7eCql'
};
