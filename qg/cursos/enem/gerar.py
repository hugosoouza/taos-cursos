"""Gera cursos/enem/dados.js (mesmo formato do curso da PMDF).

Conteúdo organizado pela equipe TAOS a partir da Matriz de Referência do ENEM (INEP).
Cada assunto vira uma lista de ETAPAS de estudo (os subtemas) e termina com uma etapa
de exercícios. Para mudar o conteúdo, edite a lista abaixo e rode:  python3 gerar.py
"""
import json, os

MIN_TEORIA = 40      # minutos por etapa de teoria
MIN_EXERC = 35       # minutos da etapa final de exercícios

# (id, nome, peso 1-3, [(assunto, [subtemas]), ...])
ENEM = [
 ("mat", "Matemática", 3, [
  ("Números e operações", ["Conjuntos numéricos e operações", "Frações, decimais e porcentagem", "Razão, proporção e regra de três", "Potências, raízes e notação científica"]),
  ("Grandezas e medidas", ["Unidades de medida e conversões", "Escalas em mapas e plantas", "Grandezas direta e inversamente proporcionais"]),
  ("Matemática financeira", ["Porcentagem no dia a dia", "Juros simples e compostos", "Acréscimos e descontos sucessivos"]),
  ("Estatística", ["Leitura de gráficos e tabelas", "Média, moda e mediana", "Dispersão e desvio padrão"]),
  ("Contagem e probabilidade", ["Princípio fundamental da contagem", "Permutação, arranjo e combinação", "Probabilidade"]),
  ("Funções", ["Conceito de função e leitura de gráficos", "Função afim", "Função quadrática", "Função exponencial e logaritmo"]),
  ("Geometria plana", ["Ângulos, triângulos e polígonos", "Semelhança e Teorema de Pitágoras", "Áreas de figuras planas", "Circunferência e círculo"]),
  ("Geometria espacial", ["Prismas e cilindros", "Pirâmides e cones", "Esfera", "Planificações, vistas e projeções"]),
  ("Trigonometria e geometria analítica", ["Trigonometria no triângulo retângulo", "Ciclo trigonométrico", "Ponto, reta e distância no plano"]),
  ("Sequências e lógica", ["Progressão aritmética", "Progressão geométrica", "Raciocínio lógico e interpretação de problemas"]),
 ]),
 ("por", "Língua Portuguesa", 3, [
  ("Interpretação de texto", ["Tema, tese e ideia central", "Inferência e pressupostos", "Intertextualidade"]),
  ("Gêneros e tipos textuais", ["Tipos textuais", "Gêneros do cotidiano e da mídia", "Publicidade, charge e tirinha"]),
  ("Funções da linguagem", ["As seis funções da linguagem", "Funções da linguagem nos textos do ENEM"]),
  ("Variação linguística", ["Tipos de variação", "Norma-padrão e preconceito linguístico"]),
  ("Coesão e coerência", ["Conectivos e relações de sentido", "Referenciação e retomada", "Coerência textual"]),
  ("Gramática no texto", ["Classes de palavras no texto", "Sintaxe e pontuação", "Concordância e regência", "Figuras de linguagem"]),
 ]),
 ("lit", "Literatura", 2, [
  ("Escolas literárias I", ["Quinhentismo e Barroco", "Arcadismo", "Romantismo"]),
  ("Escolas literárias II", ["Realismo e Naturalismo", "Parnasianismo e Simbolismo", "Pré-Modernismo"]),
  ("Modernismo", ["Semana de 22 e primeira fase", "Geração de 30", "Geração de 45 e poesia concreta"]),
  ("Literatura contemporânea", ["Literatura brasileira contemporânea", "Literaturas africanas de língua portuguesa e afro-brasileira"]),
 ]),
 ("art", "Artes, Educação Física e Tecnologia", 1, [
  ("Artes", ["Movimentos artísticos", "Arte brasileira e patrimônio cultural"]),
  ("Educação Física", ["Práticas corporais e esporte", "Corpo, saúde e mídia"]),
  ("Tecnologias da informação", ["Linguagens digitais e redes sociais", "Desinformação e leitura crítica"]),
 ]),
 ("ing", "Inglês ou Espanhol", 1, [
  ("Leitura em língua estrangeira", ["Estratégias de leitura", "Vocabulário, cognatos e falsos cognatos", "Gêneros mais cobrados"]),
 ]),
 ("his", "História", 3, [
  ("Antiguidade e Idade Média", ["Grécia e Roma", "Feudalismo", "Igreja e cultura medieval"]),
  ("Idade Moderna", ["Renascimento e Reformas", "Absolutismo e mercantilismo", "Grandes navegações"]),
  ("Brasil Colônia", ["Colonização e economia açucareira", "Escravidão e resistência", "Mineração", "Revoltas coloniais"]),
  ("Era das revoluções", ["Iluminismo", "Revolução Industrial", "Revolução Francesa", "Independências na América"]),
  ("Brasil Império", ["Independência e Primeiro Reinado", "Período Regencial", "Segundo Reinado e abolição"]),
  ("Brasil República", ["Primeira República", "Era Vargas", "Populismo e ditadura militar", "Redemocratização e Constituição de 1988"]),
  ("Mundo contemporâneo", ["Imperialismo e Primeira Guerra", "Entreguerras e Segunda Guerra", "Guerra Fria", "Globalização e mundo atual"]),
 ]),
 ("geo", "Geografia", 3, [
  ("Cartografia", ["Escalas e projeções", "Coordenadas e fusos horários", "Leitura de mapas e gráficos"]),
  ("Natureza e paisagens", ["Clima", "Relevo e solos", "Hidrografia", "Biomas brasileiros"]),
  ("Questões ambientais", ["Problemas ambientais urbanos e rurais", "Acordos e desenvolvimento sustentável"]),
  ("População e cidades", ["Demografia", "Migrações", "Urbanização e problemas urbanos"]),
  ("Campo e indústria", ["Agropecuária", "Questão agrária", "Industrialização brasileira"]),
  ("Energia e transportes", ["Matriz energética", "Transportes e logística"]),
  ("Geopolítica", ["Globalização e blocos econômicos", "Conflitos e tensões atuais"]),
 ]),
 ("fil", "Filosofia", 2, [
  ("Filosofia antiga", ["Pré-socráticos", "Sócrates, Platão e Aristóteles", "Filosofia helenística"]),
  ("Filosofia medieval e moderna", ["Agostinho e Tomás de Aquino", "Racionalismo e empirismo", "Kant e o Iluminismo"]),
  ("Ética e política", ["Contratualistas", "Ética", "Filosofia contemporânea"]),
 ]),
 ("soc", "Sociologia", 2, [
  ("Clássicos da sociologia", ["Durkheim", "Weber", "Marx"]),
  ("Cultura e sociedade", ["Cultura e identidade", "Movimentos sociais", "Cidadania e direitos"]),
  ("Trabalho e desigualdade", ["Mundo do trabalho", "Desigualdade social", "Indústria cultural e meios de comunicação"]),
 ]),
 ("fis", "Física", 3, [
  ("Mecânica", ["Cinemática", "Leis de Newton", "Trabalho, energia e potência", "Quantidade de movimento"]),
  ("Hidrostática e gravitação", ["Pressão e empuxo", "Gravitação"]),
  ("Termologia", ["Temperatura e calor", "Dilatação térmica", "Termodinâmica"]),
  ("Ondulatória e óptica", ["Ondas e som", "Óptica geométrica"]),
  ("Eletricidade e magnetismo", ["Corrente elétrica e circuitos", "Potência e consumo de energia", "Magnetismo e indução"]),
 ]),
 ("qui", "Química", 3, [
  ("Química geral", ["Atomística e tabela periódica", "Ligações químicas", "Funções inorgânicas"]),
  ("Estequiometria e soluções", ["Mol e cálculos estequiométricos", "Soluções e concentração"]),
  ("Físico-química", ["Termoquímica", "Cinética química", "Equilíbrio químico e pH", "Eletroquímica"]),
  ("Química orgânica", ["Funções orgânicas", "Isomeria", "Reações orgânicas e polímeros"]),
  ("Química ambiental", ["Poluição e tratamento de água", "Ciclos biogeoquímicos"]),
 ]),
 ("bio", "Biologia", 3, [
  ("Ecologia", ["Cadeias e teias alimentares", "Relações ecológicas", "Ciclos biogeoquímicos", "Impactos ambientais"]),
  ("Citologia", ["Célula e organelas", "Metabolismo energético", "Divisão celular"]),
  ("Genética", ["Leis de Mendel", "Genética molecular e biotecnologia"]),
  ("Evolução", ["Teorias evolutivas", "Especiação e evidências da evolução"]),
  ("Corpo humano e saúde", ["Sistemas do corpo humano", "Imunologia e vacinas", "Doenças e saúde pública"]),
  ("Seres vivos", ["Vírus e bactérias", "Botânica", "Zoologia"]),
 ]),
 ("red", "Redação", 3, [
  ("A redação do ENEM", ["As cinco competências", "Estrutura dissertativo-argumentativa", "Tema e recorte"]),
  ("Argumentação", ["Repertório sociocultural", "Tipos de argumento", "Coesão entre parágrafos"]),
  ("Proposta de intervenção", ["Os cinco elementos da proposta", "Modelos de conclusão"]),
  ("Prática de redação", ["Redação com tema inédito", "Correção pelas cinco competências"]),
 ]),
]

def gerar():
    disc = []
    for did, nome, peso, assuntos in ENEM:
        us = []
        for i, (assunto, subtemas) in enumerate(assuntos, 1):
            uid = "%s-%d" % (did, i)
            etapas = [["%s-e%d" % (uid, k), t, MIN_TEORIA * 60, 0, 0] for k, t in enumerate(subtemas, 1)]
            fim = "Redação completa e autocorreção" if did == "red" else "Exercícios: " + assunto
            etapas.append(["%s-ex" % uid, fim, MIN_EXERC * 60, 0, 0])
            us.append({"id": uid, "n": assunto, "q": "", "l": [], "a": etapas})
        disc.append({"id": did, "nome": nome, "nomeGran": nome, "peso": peso, "q": "", "u": us})
    dados = {"curso": "", "profs": ["Equipe TAOS"], "disc": disc}
    aqui = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(aqui, "dados.js"), "w", encoding="utf-8") as f:
        f.write("/* ENEM · conteúdo organizado pela equipe TAOS a partir da Matriz de Referência do ENEM (INEP).\n")
        f.write("   Gerado por cursos/enem/gerar.py. Não edite à mão: edite o gerar.py e rode de novo. */\n")
        f.write("window.GRAN=" + json.dumps(dados, ensure_ascii=False, separators=(",", ":")) + ";\n")
    n_un = sum(len(d["u"]) for d in disc); n_et = sum(len(u["a"]) for d in disc for u in d["u"])
    print("disciplinas:", len(disc), "assuntos:", n_un, "etapas:", n_et)

if __name__ == "__main__":
    gerar()
