"""Gera os planos da SEEDF (mesmo formato do ENEM e da PMDF):
   cursos/seedf-pedagogia/dados.js, cursos/seedf-analista/dados.js e cursos/seedf-monitor/dados.js

Base: Termo de Referência nº 3/2026 da SEEDF (temas obrigatórios dos conhecimentos básicos:
realidade do DF e da RIDE, Lei Orgânica do DF, LC nº 840/2011, Plano Distrital de Política
para Mulheres, Lei Maria da Penha e primeiros socorros), atribuições de cada cargo no mesmo
TR e o edital de 2022 (Quadrix). Quando o edital de 2026 sair, ajuste as listas e rode:
    python3 seedf-gerar.py
"""
import json, os

MIN_TEORIA = 40      # minutos por etapa de teoria
MIN_EXERC = 35       # minutos da etapa final de exercícios

# (id, nome, peso 1-3, [(assunto, [subtemas]), ...])

# ---------- Conhecimentos básicos: iguais para os três cargos ----------
PORTUGUES = ("por", "Língua Portuguesa", 3, [
    ("Compreensão e interpretação de textos", ["Ideia central, tese e argumentos", "Inferências, pressupostos e subentendidos", "Tipos e gêneros textuais"]),
    ("Ortografia e acentuação", ["Ortografia oficial", "Acentuação gráfica", "Emprego do hífen"]),
    ("Morfologia", ["Classes de palavras", "Emprego dos pronomes", "Tempos e modos verbais"]),
    ("Sintaxe", ["Termos da oração", "Período composto: coordenação e subordinação", "Pontuação"]),
    ("Concordância, regência e crase", ["Concordância nominal e verbal", "Regência nominal e verbal", "Emprego do sinal indicativo de crase"]),
    ("Coesão e reescrita", ["Mecanismos de coesão", "Colocação pronominal", "Reescrita de frases e parágrafos"]),
])
REALIDADE_DF = ("df", "Realidade do DF e da RIDE", 2, [
    ("História do DF", ["Antecedentes da mudança da capital", "A construção de Brasília", "Brasília de 1960 aos dias de hoje"]),
    ("Geografia do DF", ["Cerrado, clima e hidrografia", "Regiões administrativas e ocupação do território", "Problemas urbanos e ambientais"]),
    ("Sociedade, economia e cultura", ["População e realidade étnica e social", "Economia do DF", "Cultura, patrimônio e manifestações populares"]),
    ("Política e RIDE", ["Organização política e administrativa do DF", "RIDE: LC nº 94/1998 e os municípios do Entorno"]),
])
LODF = ("lodf", "Lei Orgânica do DF", 2, [
    ("Fundamentos e organização do DF", ["Princípios fundamentais", "Competências do Distrito Federal", "Organização administrativa e regiões administrativas"]),
    ("Administração pública na LODF", ["Princípios da administração pública", "Servidores públicos na LODF"]),
    ("Educação na LODF", ["A educação na Lei Orgânica", "Gestão democrática e valorização dos profissionais da educação"]),
])
LC840 = ("lc840", "Regime Jurídico dos Servidores do DF (LC nº 840/2011)", 2, [
    ("Provimento e vacância", ["Formas de provimento, posse e exercício", "Estágio probatório e estabilidade", "Vacância, remoção e redistribuição"]),
    ("Direitos e vantagens", ["Remuneração, gratificações e adicionais", "Férias, licenças e afastamentos"]),
    ("Deveres e responsabilidades", ["Deveres e proibições", "Responsabilidades civil, penal e administrativa"]),
    ("Regime disciplinar", ["Infrações e penalidades", "Processo administrativo disciplinar"]),
])
MULHERES = ("mul", "Direitos das Mulheres", 2, [
    ("Lei Maria da Penha (Lei nº 11.340/2006)", ["Formas de violência doméstica e familiar", "Medidas integradas de prevenção e assistência", "Medidas protetivas de urgência", "Atendimento pela autoridade policial e crimes previstos"]),
    ("Plano Distrital de Política para Mulheres", ["Eixos e objetivos do plano", "A rede de enfrentamento à violência no DF"]),
])
def socorros(peso):
    return ("ps", "Noções de Primeiros Socorros", peso, [
        ("Primeiros socorros", ["Avaliação da cena e acionamento do socorro", "Parada cardiorrespiratória e RCP", "Engasgo em adultos, crianças e bebês", "Hemorragias, fraturas e queimaduras", "Convulsões, desmaios e intoxicações"]),
    ])

# ---------- Conhecimentos complementares ----------
def legislacao(peso):
    return ("leg", "Legislação Educacional", peso, [
        ("Constituição Federal e educação", ["A educação na Constituição (arts. 205 a 214)", "Financiamento da educação e Fundeb"]),
        ("LDB (Lei nº 9.394/1996)", ["Princípios e fins da educação nacional", "Organização da educação nacional", "Níveis e modalidades de ensino", "Profissionais da educação"]),
        ("ECA (Lei nº 8.069/1990)", ["Direitos fundamentais da criança e do adolescente", "Direito à educação e Conselho Tutelar", "Medidas de proteção"]),
        ("Planos e normas do DF", ["PNE e Plano Distrital de Educação", "Gestão democrática (Lei nº 4.751/2012)", "Regimento Escolar da Rede Pública do DF"]),
        ("Inclusão e diversidade", ["Lei Brasileira de Inclusão (Lei nº 13.146/2015)", "Educação para as relações étnico-raciais (Leis nº 10.639/2003 e 11.645/2008)", "Educação em direitos humanos"]),
    ])

CURRICULO = ("cur", "Currículo em Movimento e Avaliação", 3, [
    ("Currículo em Movimento: pressupostos teóricos", ["Pedagogia histórico-crítica e psicologia histórico-cultural", "Eixos transversais do currículo", "Organização escolar em ciclos"]),
    ("Avaliação", ["Diretrizes de Avaliação Educacional da SEEDF", "Avaliação formativa", "Avaliação em larga escala e institucional"]),
    ("Projeto Político-Pedagógico", ["Construção e gestão do PPP", "Coordenação pedagógica"]),
])
FUNDAMENTOS = ("fund", "Fundamentos da Educação e Didática", 3, [
    ("Tendências pedagógicas", ["Pedagogias liberais", "Pedagogias progressistas", "Paulo Freire e a educação libertadora"]),
    ("Teorias da aprendizagem", ["Piaget", "Vygotsky", "Wallon"]),
    ("Didática e planejamento", ["Planejamento de ensino e plano de aula", "Metodologias ativas e interdisciplinaridade", "Relação professor-aluno e gestão da sala"]),
    ("Educação inclusiva", ["Educação especial na perspectiva inclusiva", "Adequação curricular", "Atendimento educacional especializado"]),
])

# ---------- Conhecimentos específicos ----------
PEDAGOGIA = [
    ("alf", "Alfabetização e Letramento", 3, [
        ("Psicogênese da língua escrita", ["Hipóteses de escrita (Emilia Ferreiro)", "Intervenções para cada hipótese de escrita"]),
        ("Alfabetização e letramento", ["Alfabetização e letramento (Magda Soares)", "Consciência fonológica", "Métodos de alfabetização"]),
        ("Bloco Inicial de Alfabetização", ["O BIA e a organização em ciclos", "Reagrupamento e projeto interventivo"]),
        ("Ensino de Língua Portuguesa", ["Leitura e produção de textos nos anos iniciais", "Oralidade e análise linguística"]),
    ]),
    ("einf", "Educação Infantil", 3, [
        ("Fundamentos", ["Concepções de infância", "Cuidar e educar"]),
        ("Documentos orientadores", ["Diretrizes Curriculares Nacionais da Educação Infantil", "BNCC: direitos de aprendizagem e campos de experiência", "Currículo em Movimento: Educação Infantil"]),
        ("Prática pedagógica", ["Interações e brincadeiras", "Rotina, tempos e espaços", "Avaliação e registro na Educação Infantil"]),
    ]),
    ("ai", "Ensino nos Anos Iniciais", 2, [
        ("Matemática", ["Sistema de numeração decimal", "Operações e resolução de problemas", "Grandezas, medidas e geometria"]),
        ("Ciências Humanas e da Natureza", ["Ensino de História e Geografia", "Ensino de Ciências"]),
        ("BNCC nos anos iniciais", ["Competências gerais da BNCC", "Progressão das aprendizagens"]),
    ]),
]
ANALISTA = [
    ("adm", "Direito Administrativo", 3, [
        ("Administração pública", ["Princípios da administração pública", "Organização administrativa: direta e indireta"]),
        ("Atos e poderes", ["Atos administrativos", "Poderes administrativos"]),
        ("Licitações e contratos (Lei nº 14.133/2021)", ["Modalidades e fases da licitação", "Contratação direta", "Contratos administrativos"]),
        ("Controle e transparência", ["Improbidade administrativa (Lei nº 8.429/1992)", "Processo administrativo", "Lei de Acesso à Informação e LGPD"]),
    ]),
    ("gest", "Administração Geral e Pública", 3, [
        ("Funções administrativas", ["Planejamento, organização, direção e controle", "Gestão de processos e qualidade"]),
        ("Gestão de pessoas", ["Recrutamento, avaliação de desempenho e capacitação", "Rotinas de pessoal: frequência, férias e folha de pagamento"]),
        ("Gestão de materiais e patrimônio", ["Almoxarifado e controle de estoque", "Patrimônio e inventário"]),
        ("Orçamento público", ["Princípios orçamentários", "PPA, LDO e LOA", "Receita e despesa pública"]),
    ]),
    ("arq", "Arquivologia e Redação Oficial", 2, [
        ("Arquivologia", ["Conceitos e ciclo de vida dos documentos", "Protocolo: recebimento, registro e tramitação", "Classificação, arquivamento e tabela de temporalidade"]),
        ("Redação oficial", ["Manual de Redação da Presidência da República", "Ofício e demais expedientes oficiais"]),
    ]),
    ("inf", "Informática", 1, [
        ("Informática para o serviço público", ["Editores de texto", "Planilhas eletrônicas", "Internet, correio eletrônico e segurança da informação", "Sistema Eletrônico de Informações (SEI)"]),
    ]),
    ("etic", "Ética no Serviço Público", 1, [
        ("Ética e atendimento", ["Código de Ética dos Servidores do DF (Decreto nº 37.297/2016)", "Atendimento ao público"]),
    ]),
]
MONITOR = [
    ("dinf", "Desenvolvimento Infantil", 3, [
        ("Teorias do desenvolvimento", ["Piaget", "Vygotsky", "Wallon"]),
        ("Etapas do desenvolvimento", ["Desenvolvimento motor, cognitivo e afetivo", "Linguagem e socialização"]),
        ("Brincar e ludicidade", ["O brincar e a aprendizagem", "Contação de histórias, música e artes"]),
    ]),
    ("cuid", "Cuidar e Educar na Escola", 3, [
        ("Educação Infantil", ["Cuidar e educar", "DCNEI e BNCC: campos de experiência", "Rotina, acolhimento e adaptação"]),
        ("Higiene, alimentação e sono", ["Higiene e autonomia da criança", "Alimentação escolar e momentos de refeição", "Sono, descanso e bem-estar"]),
        ("Segurança e proteção", ["Prevenção de acidentes na escola", "Sinais de violência e maus-tratos", "Relação com as famílias e a equipe escolar"]),
    ]),
    ("esp", "Educação Especial e Inclusão", 3, [
        ("Educação inclusiva", ["Educação especial na perspectiva inclusiva", "Lei Brasileira de Inclusão"]),
        ("Deficiências e transtornos", ["Deficiência física e mobilidade", "Deficiência intelectual", "Transtorno do Espectro Autista (TEA)", "Deficiências sensoriais"]),
        ("Apoio ao estudante", ["Atividades de vida diária e autonomia", "Mediação e condutas adaptativas", "Locomoção, transferência e postura"]),
    ]),
]

BASICOS = [PORTUGUES, REALIDADE_DF, LODF, LC840, MULHERES]
CURSOS = {
    "seedf-pedagogia": ("Professor de Educação Básica · Pedagogia", BASICOS + [socorros(1), legislacao(3), CURRICULO, FUNDAMENTOS] + PEDAGOGIA),
    "seedf-analista": ("Analista · Apoio Administrativo", BASICOS + [socorros(1), legislacao(2)] + ANALISTA),
    "seedf-monitor": ("Analista · Monitor em Gestão Educacional", BASICOS + [socorros(2), legislacao(2)] + MONITOR),
}

def gerar(cid, titulo, materias):
    disc = []
    for did, nome, peso, assuntos in materias:
        us = []
        for i, (assunto, subtemas) in enumerate(assuntos, 1):
            uid = "%s-%d" % (did, i)
            etapas = [["%s-e%d" % (uid, k), t, MIN_TEORIA * 60, 0, 0] for k, t in enumerate(subtemas, 1)]
            etapas.append(["%s-ex" % uid, "Exercícios: " + assunto, MIN_EXERC * 60, 0, 0])
            us.append({"id": uid, "n": assunto, "q": "", "l": [], "a": etapas})
        disc.append({"id": did, "nome": nome, "nomeGran": nome, "peso": peso, "q": "", "u": us})
    ids = [d["id"] for d in disc]
    assert len(ids) == len(set(ids)), cid
    dados = {"curso": "", "profs": ["Equipe TAOS"], "disc": disc}
    pasta = os.path.join(os.path.dirname(os.path.abspath(__file__)), cid)
    os.makedirs(pasta, exist_ok=True)
    with open(os.path.join(pasta, "dados.js"), "w", encoding="utf-8") as f:
        f.write("/* SEEDF · %s · plano organizado pela equipe TAOS (Termo de Referência nº 3/2026 e edital de 2022).\n" % titulo)
        f.write("   Gerado por cursos/seedf-gerar.py. Não edite à mão: edite o seedf-gerar.py e rode de novo. */\n")
        f.write("window.GRAN=" + json.dumps(dados, ensure_ascii=False, separators=(",", ":")) + ";\n")
    mat = os.path.join(pasta, "materiais.js")
    if not os.path.exists(mat):  # não apaga a lista de PDFs já cadastrada
        with open(mat, "w", encoding="utf-8") as f:
            f.write("/* PDFs da SEEDF: nenhum por enquanto. */\nwindow.TATICO_PDF = {};\n")
    n_un = sum(len(d["u"]) for d in disc); n_et = sum(len(u["a"]) for d in disc for u in d["u"])
    print("%-16s matérias: %2d  assuntos: %2d  etapas: %3d" % (cid, len(disc), n_un, n_et))

if __name__ == "__main__":
    for cid, (titulo, materias) in CURSOS.items():
        gerar(cid, titulo, materias)
