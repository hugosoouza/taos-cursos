# Aulas em PDF da TAOS Educação

Fonte das aulas escritas da SEEDF. Cada aula é um arquivo `.aula` em `aulas/` (texto simples).

Gerar uma aula (precisa do Google Chrome instalado):

    python3 fonte-pdf/gerar.py ped-lc840-1-provimento-e2

Gerar todas:

    python3 fonte-pdf/gerar.py

O PDF sai direto em `qg/cursos/<curso>/`. O formato do `.aula` está explicado no topo do `gerar.py`.
Visual (cores, capa, quadros): `aula.css`.
