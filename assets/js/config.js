/*
  CONFIGURAÇÃO DA PLATAFORMA TAOS
  Troque aqui o número do WhatsApp e as mentorias. O site se atualiza sozinho.
  Número: código do país + DDD + número, só dígitos. Ex.: 5561999999999
*/
window.TAOS_CONFIG = {
  whatsapp: "5561999999999", // NÚMERO DE EXEMPLO: troque pelo número real

  mensagemGeral: "Olá! Quero saber mais sobre as mentorias da TAOS Cursos.",

  mentorias: [
    {
      sigla: "PMDF",
      nome: "Polícia Militar do Distrito Federal",
      uf: "DF",
      carreira: "Militar",
      resumo: "Preparação direcionada para o concurso da PMDF, com foco no que a banca mais cobra.",
    },
    {
      sigla: "PMGO",
      nome: "Polícia Militar de Goiás",
      uf: "GO",
      carreira: "Militar",
      resumo: "Plano de estudos para a PMGO, organizado por prioridade de conteúdo.",
    },
    {
      sigla: "PCTO",
      nome: "Polícia Civil do Tocantins",
      uf: "TO",
      carreira: "Civil",
      resumo: "Mentoria para a PCTO, com rotina de estudo e revisões guiadas.",
    },
    {
      sigla: "PCMG",
      nome: "Polícia Civil de Minas Gerais",
      uf: "MG",
      carreira: "Civil",
      resumo: "Acompanhamento para a PCMG, do edital à reta final da prova.",
    },
  ],

  // Itens que aparecem em todos os cards de mentoria
  incluso: [
    "Cronograma de estudos semanal",
    "Acompanhamento individual pelo WhatsApp",
    "Revisões e questões no estilo da banca",
    "Acesso à área do aluno",
  ],
};
