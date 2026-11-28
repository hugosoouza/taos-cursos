/*
  CONFIGURAÇÃO DA PLATAFORMA TAOS
  Troque aqui o número do WhatsApp e as mentorias. O site se atualiza sozinho.
  Número: código do país + DDD + número, só dígitos. Ex.: 5561999999999
*/
window.TAOS_CONFIG = {
  whatsapp: "5561999096841", // NÚMERO TEMPORÁRIO: trocar pelo definitivo depois

  mensagemGeral: "Olá! Quero saber mais sobre os cursos da TAOS.",

  // DADOS DA EMPRESA (aparecem no rodapé e nas páginas legais).
  // Campo vazio = não aparece. Preencha assim que tiver os dados oficiais.
  empresa: {
    nome: "TAOS Cursos",
    razaoSocial: "",   // ex.: "TAOS Cursos Preparatórios LTDA"
    cnpj: "",          // ex.: "00.000.000/0001-00"
    endereco: "",      // ex.: "Brasília - DF"
    email: "",         // e-mail de contato e do encarregado de dados (LGPD)
  },

  // Áreas em que a TAOS atua (seção "Áreas" e formulário de inscrição)
  areas: [
    { id: "vestibular", nome: "Vestibulares e ENEM", texto: "Preparação para o ENEM e os principais vestibulares do país." },
    { id: "militar", nome: "Militar e policial", texto: "Polícias Militares, Polícias Civis e demais carreiras de segurança pública." },
    { id: "saude", nome: "Saúde", texto: "Concursos e seleções para as carreiras da área da saúde." },
    { id: "educacao", nome: "Educação", texto: "Concursos para professores e demais carreiras da educação." },
    { id: "outros", nome: "Outros concursos", texto: "Tribunais, área administrativa e outras carreiras públicas. Fale com a gente." },
  ],

  mentorias: [
    {
      sigla: "PMDF",
      nome: "Polícia Militar do Distrito Federal",
      uf: "DF",
      carreira: "Militar",
      area: "militar",
      grupo: "Polícia Militar",
      resumo: "Preparação direcionada para o concurso da PMDF, com foco no que a banca mais cobra.",
    },
    {
      sigla: "PMGO",
      nome: "Polícia Militar de Goiás",
      uf: "GO",
      carreira: "Militar",
      area: "militar",
      grupo: "Polícia Militar",
      resumo: "Plano de estudos para a PMGO, organizado por prioridade de conteúdo.",
    },
    {
      sigla: "PCTO",
      nome: "Polícia Civil do Tocantins",
      uf: "TO",
      carreira: "Civil",
      area: "militar",
      grupo: "Polícia Civil",
      resumo: "Plano de estudos para a PCTO, com rotina de estudo e revisões guiadas.",
    },
    {
      sigla: "PCMG",
      nome: "Polícia Civil de Minas Gerais",
      uf: "MG",
      carreira: "Civil",
      area: "militar",
      grupo: "Polícia Civil",
      resumo: "Acompanhamento para a PCMG, do edital à reta final da prova.",
    },
    {
      sigla: "ENEM",
      artigo: "o",
      nome: "Exame Nacional do Ensino Médio",
      uf: "BR",
      carreira: "Vestibular",
      area: "vestibular",
      grupo: "ENEM e Vestibular",
      resumo: "Plano de estudo para as quatro áreas do ENEM e a redação, organizado pela matriz do INEP.",
    },
    {
      sigla: "SEEDF",
      nome: "Secretaria de Educação do DF",
      uf: "DF",
      carreira: "Educação",
      area: "educacao",
      grupo: "Educação",
      resumo: "Planos separados para Professor de Pedagogia, Analista de Apoio Administrativo e Monitor, montados a partir do Termo de Referência do concurso.",
    },
  ],

  // Itens que aparecem em todos os cards de mentoria
  incluso: [
    "Cronograma de estudos semanal",
    "Acompanhamento da turma e tira-dúvidas pelo WhatsApp",
    "Revisões e questões no estilo da banca",
    "Acesso à área do aluno",
  ],
};
