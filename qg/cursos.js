/*
  CURSOS DO TAOS MILITAR
  Cada curso tem a sua sigla, as suas cores e as suas matérias (pasta cursos/<id>/).
  "pronto: false" mostra a tela "QG em preparação" até as matérias serem carregadas.
  As cores são inspiradas em cada corporação, sem usar brasões ou símbolos oficiais.
*/
(function () {
  var PM = [[0,'Recruta',0],[300,'Soldado',1],[1000,'Cabo',2],[2500,'3º Sargento',3],[5000,'2º Sargento',4],[9000,'1º Sargento',5],[15000,'Subtenente',6],[25000,'Aspirante',7],[40000,'Tenente',8]];
  var PC = [[0,'Recruta',0],[300,'Agente',1],[1000,'Agente 3ª classe',2],[2500,'Agente 2ª classe',3],[5000,'Agente 1ª classe',4],[9000,'Agente especial',5],[15000,'Investigador',6],[25000,'Inspetor',7],[40000,'Delegado',8]];

  window.TAOS_CURSOS = {
    pmdf: {
      id: 'pmdf', divisao: 'militar', marca: 'MILITAR', sigla: 'PMDF', nome: 'Polícia Militar do Distrito Federal', uf: 'DF',
      cargo: 'Soldado', carreira: 'Militar', pronto: true, base: 'cursos/pmdf/',
      lema: 'Missão: farda azul do DF',
      patentes: PM,
      tema: { bg:'#070c17', surface:'#0e1628', surface2:'#0a111f', ink:'#e7ecf6', muted:'#8d99b0', line:'#1d2940', line2:'#24324d',
        side:'#050913', side2:'#111b30', 'side-ink':'#c9d2e3', 'side-muted':'#6f7c95',
        acc:'#4f8ff0', 'acc-ink':'#ffffff', 'acc-soft':'#13213b', gold:'#d6a630', 'gold-soft':'#262010', 'gold-line':'#5a4813',
        hero:'#0b1324', hero2:'#111c33', 'hero-ink':'#eef2fa', 'hero-muted':'#97a3ba', sh:'5,9,19', 'acc-rgb':'79,143,240' },
      camo: ['#0b1322','#122038','#18294a','#060b16']
    },
    pmgo: {
      id: 'pmgo', divisao: 'militar', marca: 'MILITAR', sigla: 'PMGO', nome: 'Polícia Militar de Goiás', uf: 'GO',
      cargo: 'Soldado', carreira: 'Militar', pronto: false, base: 'cursos/pmgo/',
      lema: 'Missão: tropa de Goiás',
      patentes: PM,
      tema: { bg:'#0b0d14', surface:'#141823', surface2:'#0f121b', ink:'#ebecf1', muted:'#9396a6', line:'#232837', line2:'#2c3243',
        side:'#07080d', side2:'#161a26', 'side-ink':'#cfd1dc', 'side-muted':'#7a7e90',
        acc:'#e0393e', 'acc-ink':'#ffffff', 'acc-soft':'#2a1418', gold:'#d6a630', 'gold-soft':'#262010', 'gold-line':'#5a4813',
        hero:'#10131c', hero2:'#171b27', 'hero-ink':'#f1f2f6', 'hero-muted':'#9b9eae', sh:'7,8,13', 'acc-rgb':'224,57,62' },
      camo: ['#11141d','#1a1e2b','#232838','#0a0c12']
    },
    pcto: {
      id: 'pcto', divisao: 'militar', marca: 'MILITAR', sigla: 'PCTO', nome: 'Polícia Civil do Tocantins', uf: 'TO',
      cargo: 'Agente', carreira: 'Civil', pronto: false, base: 'cursos/pcto/',
      lema: 'Missão: investigação no Tocantins',
      patentes: PC,
      tema: { bg:'#070f14', surface:'#0e1a22', surface2:'#0a141b', ink:'#e6eef2', muted:'#8aa0ab', line:'#1b2c36', line2:'#223845',
        side:'#050c11', side2:'#102029', 'side-ink':'#c6d6de', 'side-muted':'#6c8592',
        acc:'#f2c230', 'acc-ink':'#111111', 'acc-soft':'#2a2410', gold:'#4fb8e8', 'gold-soft':'#0f2430', 'gold-line':'#1d4a60',
        hero:'#0b161d', hero2:'#112029', 'hero-ink':'#eef5f8', 'hero-muted':'#95aab4', sh:'5,12,17', 'acc-rgb':'242,194,48' },
      camo: ['#0b161d','#12222c','#183040','#060d12']
    },
    pcmg: {
      id: 'pcmg', divisao: 'militar', marca: 'MILITAR', sigla: 'PCMG', nome: 'Polícia Civil de Minas Gerais', uf: 'MG',
      cargo: 'Investigador', carreira: 'Civil', pronto: false, base: 'cursos/pcmg/',
      lema: 'Missão: investigação em Minas',
      patentes: PC,
      tema: { bg:'#0b0b0d', surface:'#151517', surface2:'#101012', ink:'#ececec', muted:'#9a9a9e', line:'#26262a', line2:'#303034',
        side:'#070708', side2:'#18181b', 'side-ink':'#d4d4d8', 'side-muted':'#7d7d84',
        acc:'#c9a54a', 'acc-ink':'#111111', 'acc-soft':'#262010', gold:'#dcdcdc', 'gold-soft':'#1f1f22', 'gold-line':'#444448',
        hero:'#101012', hero2:'#18181b', 'hero-ink':'#f2f2f2', 'hero-muted':'#a0a0a5', sh:'7,7,8', 'acc-rgb':'201,165,74' },
      camo: ['#121214','#1b1b1e','#252528','#0a0a0b']
    }
  };
  window.TAOS_ORDEM = ['pmdf', 'pmgo', 'pcto', 'pcmg'];

  /* DIVISÕES DA ÁREA DO ALUNO
     Cada curso pertence a uma divisão (campo "divisao"). O aluno só vê as divisões
     em que tem curso liberado. Para criar um curso de Saúde, por exemplo, use divisao: 'saude'. */
  window.TAOS_DIVISOES = {
    militar:    { id: 'militar',    nome: 'TAOS Militar',           curto: 'Militar',           desc: 'Carreiras militares e policiais', cor: '#d6a630', corRgb: '214,166,48', tinta: '#1a1405', cta: 'Entrar no QG', icone: 'escudo' },
    saude:      { id: 'saude',      nome: 'TAOS Saúde',             curto: 'Saúde',             desc: 'Concursos da área da saúde',      cor: '#2ec4a6', corRgb: '46,196,166', tinta: '#04211b', cta: 'Começar a estudar', icone: 'cruz' },
    vestibular: { id: 'vestibular', nome: 'TAOS ENEM e Vestibular', curto: 'ENEM e Vestibular', desc: 'ENEM e principais vestibulares',  cor: '#8f9bff', corRgb: '143,155,255', tinta: '#0b0f33', cta: 'Começar a estudar', icone: 'capelo' },
    educacao:   { id: 'educacao',   nome: 'TAOS Educação',          curto: 'Educação',          desc: 'Concursos da educação',           cor: '#ffa24c', corRgb: '255,162,76', tinta: '#2b1500', cta: 'Começar a estudar', icone: 'livro' }
  };
  window.TAOS_DIV_ORDEM = ['militar', 'saude', 'vestibular', 'educacao'];
  window.TAOS_WHATSAPP = '5561999096841'; // temporário
  window.TAOS_SITE = 'https://hugosoouza.github.io/taos-cursos/qg/';
})();
