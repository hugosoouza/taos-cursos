#!/usr/bin/env python3
"""TAOS Educação · gerador das aulas em PDF.

Cada aula é um arquivo .aula em fonte-pdf/aulas/ (texto simples, fácil de editar).
Uso:
    python3 fonte-pdf/gerar.py                      # gera todas as aulas
    python3 fonte-pdf/gerar.py ped-lc840-1-provimento-e2   # gera só uma

O PDF sai direto na pasta do curso (qg/cursos/<curso>/<id>.pdf), pronto para publicar.
Precisa do Google Chrome instalado (ele imprime o HTML em PDF).

FORMATO DO .aula
  Cabeçalho entre linhas '---' (chave: valor): id, curso, cargo, materia, assunto, etapa, total,
  titulo, tempo, objetivos (separados por ' ; ').
  # Título da seção | subtítulo        -> nova seção numerada
  ## Subtítulo                          -> subtítulo dentro da seção
  Parágrafos, **negrito**, *itálico*, listas com '- ' ou '1. ', tabelas com '|'.
  Blocos:  :::doc Título  /  :::sala Título  /  :::pegadinha Título  /  :::macete Título
           :::atencao Título  /  :::resumo Título  /  :::exemplo Título   ...  :::
  Checkpoint:  :::cp ce   (certo ou errado)   ou   :::cp me   (múltipla escolha)
               enunciado; alternativas 'a) ...'; última linha '= C | explicação'  ... :::
"""
import html, os, re, subprocess, sys, tempfile

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
PASTA_CURSO = {'ped': 'seedf-pedagogia', 'ana': 'seedf-analista', 'mon': 'seedf-monitor'}

# ---------------------------------------------------------------- texto em linha
def inline(t):
    t = html.escape(t, quote=False)
    t = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', t)
    t = re.sub(r'(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])', r'<i>\1</i>', t)
    t = re.sub(r'==(.+?)==', r'<mark>\1</mark>', t)
    return t

def _li(x):
    if '<ul>' in x:
        cab, resto = x.split('<ul>', 1)
        return inline(cab) + '<ul>' + resto
    return inline(x)

# ---------------------------------------------------------------- blocos de texto
def corpo(linhas):
    """Converte linhas soltas (parágrafos, listas, tabelas, subtítulos) em HTML."""
    out, i = [], 0
    while i < len(linhas):
        l = linhas[i].rstrip()
        if not l.strip():
            i += 1; continue
        if l.startswith('## '):
            out.append('<h3>' + inline(l[3:]) + '</h3>'); i += 1; continue
        if l.lstrip().startswith('|'):
            rows = []
            while i < len(linhas) and linhas[i].lstrip().startswith('|'):
                rows.append([c.strip() for c in linhas[i].strip().strip('|').split('|')]); i += 1
            rows = [r for r in rows if not all(re.fullmatch(r':?-{2,}:?', c) for c in r)]
            h = '<table><thead><tr>' + ''.join('<th>' + inline(c) + '</th>' for c in rows[0]) + '</tr></thead><tbody>'
            h += ''.join('<tr>' + ''.join('<td>' + inline(c) + '</td>' for c in r) + '</tr>' for r in rows[1:])
            out.append(h + '</tbody></table>'); continue
        m = re.match(r'(\s*)(- |\d+\. )', l)
        if m:
            tag = 'ol' if m.group(2)[0].isdigit() else 'ul'
            itens = []
            while i < len(linhas) and re.match(r'\s*(- |\d+\. )', linhas[i]):
                if re.match(r'\s{2,}- ', linhas[i]) and itens:
                    subs = []
                    while i < len(linhas) and re.match(r'\s{2,}- ', linhas[i]):
                        subs.append(linhas[i].strip()[2:]); i += 1
                    itens[-1] += '<ul>' + ''.join('<li>' + inline(x) + '</li>' for x in subs) + '</ul>'
                    continue
                itens.append(re.sub(r'^\s*(- |\d+\. )', '', linhas[i].rstrip())); i += 1
                while i < len(linhas) and linhas[i].startswith('  ') and linhas[i].strip() and not re.match(r'\s*(- |\d+\. )', linhas[i]):
                    itens[-1] += ' ' + linhas[i].strip(); i += 1
            out.append('<%s>%s</%s>' % (tag, ''.join('<li>' + _li(x) + '</li>' for x in itens), tag)); continue
        par = [l.strip()]; i += 1
        while i < len(linhas) and linhas[i].strip() and not re.match(r'\s*(- |\d+\. |\||## )', linhas[i]):
            par.append(linhas[i].strip()); i += 1
        out.append('<p>' + inline(' '.join(par)) + '</p>')
    return '\n'.join(out)

CAIXAS = {
    'doc': ('§', 'Documento'), 'sala': ('✎', 'Na sala de aula'), 'pegadinha': ('!', 'Pegadinha da banca'),
    'macete': ('★', 'Macete'), 'atencao': ('i', 'Atenção'), 'resumo': ('≡', 'Resumo'), 'exemplo': ('→', 'Exemplo'),
    'pense': ('?', 'Pare e pense'), 'juris': ('⚖', 'Jurisprudência'), 'compara': ('⇄', 'Compare'), 'erro': ('✕', 'Erro comum'),
}

def bloco_especial(tipo, tit, dentro):
    """Blocos visuais: linha do tempo, flashcards e mapa mental."""
    if tipo == 'linha':
        pts = [[c.strip() for c in l.split('|')] for l in dentro if l.strip()]
        h = '<div class="tl">' + ('<div class="tl-t">' + inline(tit) + '</div>' if tit else '') + '<div class="tl-bar">'
        for k, pt in enumerate(pts):
            pos, rot = pt[0], pt[1]
            det = pt[2] if len(pt) > 2 else ''
            lado = 'cima' if k % 2 == 0 else 'baixo'
            h += f'<div class="tl-p"><i></i><span><b>{inline(rot)}</b>{inline(det)}</span></div>'
        return h + '</div></div>'
    if tipo == 'cards':
        pares = [l.split('||') for l in dentro if '||' in l]
        h = '<div class="fc-t">' + inline(tit or 'Flashcards') + '<small>Cubra a coluna da direita e tente responder. Depois confira.</small></div><div class="fc">'
        for k, (q, r) in enumerate(pares):
            h += f'<div class="fc-q"><span>{k+1:02d}</span>{inline(q.strip())}</div><div class="fc-r">{inline(r.strip())}</div>'
        return h + '</div>'
    if tipo == 'mapa':
        ramos, atual_r = [], None
        for l in dentro:
            if l.startswith('## '):
                atual_r = [l[3:].strip(), []]; ramos.append(atual_r)
            elif l.strip().startswith('- ') and atual_r:
                atual_r[1].append(l.strip()[2:])
        h = '<div class="mapa"><div class="mapa-c">' + inline(tit) + '</div><div class="mapa-g">'
        for nome, itens in ramos:
            h += '<div class="mapa-r"><b>' + inline(nome) + '</b><ul>' + ''.join('<li>' + inline(x) + '</li>' for x in itens) + '</ul></div>'
        return h + '</div></div>'
    return None

def ler(caminho):
    txt = open(caminho, encoding='utf-8').read()
    m = re.match(r'---\n(.*?)\n---\n(.*)', txt, re.S)
    meta = {}
    for l in m.group(1).splitlines():
        if ':' in l:
            k, v = l.split(':', 1); meta[k.strip()] = v.strip()
    return meta, m.group(2)

def montar(meta, texto):
    secoes, atual, cps = [], None, []
    linhas, i = texto.splitlines(), 0
    buf = []
    def fecha_buf():
        if buf and atual is not None:
            atual['html'].append(corpo(buf))
        buf.clear()
    while i < len(linhas):
        l = linhas[i]
        if l.startswith('# '):
            fecha_buf()
            t, _, s = l[2:].partition('|')
            atual = {'t': t.strip(), 's': s.strip(), 'html': []}; secoes.append(atual); i += 1; continue
        if l.startswith(':::'):
            fecha_buf()
            tipo, _, tit = l[3:].strip().partition(' ')
            j = i + 1; dentro = []
            while j < len(linhas) and linhas[j].strip() != ':::':
                dentro.append(linhas[j]); j += 1
            i = j + 1
            if tipo == 'cp':
                fmt = tit.strip() or 'ce'
                gab = [x for x in dentro if x.startswith('= ')][-1][2:]
                letra, _, porque = gab.partition('|')
                enun = [x for x in dentro if not x.startswith('= ') and not re.match(r'[a-e]\) ', x)]
                alts = [x for x in dentro if re.match(r'[a-e]\) ', x)]
                n = len(cps) + 1
                cps.append((n, letra.strip(), porque.strip()))
                h = '<div class="cp"><div class="cp-h"><span>✓ Checkpoint %d</span><em>%s</em></div><div class="cp-b">%s' % (
                    n, 'Certo ou errado' if fmt == 'ce' else 'Múltipla escolha', corpo(enun))
                if fmt == 'ce':
                    h += '<div class="opts"><span class="box"></span> Certo <span class="box"></span> Errado</div>'
                else:
                    h += '<ol class="alts">' + ''.join('<li><b>%s)</b> %s</li>' % (a[0].upper(), inline(a[3:])) for a in alts) + '</ol>'
                atual['html'].append(h + '</div></div>')
            elif bloco_especial(tipo, tit, dentro) is not None:
                atual['html'].append(bloco_especial(tipo, tit, dentro))
            else:
                ic, nome = CAIXAS[tipo]
                cab = nome + (' · ' + tit if tit else '')
                atual['html'].append('<div class="box-%s caixa"><div class="cx-h"><span class="ic">%s</span>%s</div>%s</div>' % (
                    tipo, ic, inline(cab), corpo(dentro)))
            continue
        buf.append(l); i += 1
    fecha_buf()
    return secoes, cps

CSS = open(os.path.join(AQUI, 'aula.css'), encoding='utf-8').read()

def html_aula(meta, secoes, cps):
    e = html.escape
    materia_curta = meta.get('materia_curta', meta['materia'])
    cabeca = '%s · %s · ETAPA %s' % (materia_curta.upper(), meta['assunto'].upper(), meta['etapa'])
    objetivos = [o.strip() for o in meta.get('objetivos', '').split(';') if o.strip()]
    capa = f'''
<section class="capa">
  <div class="faixa"></div>
  <div class="capa-top"><div class="logo">{LOGO}<span class="sep"></span><span><b>TAOS</b><i>EDUCAÇÃO</i></span></div>
    <div class="capa-cargo">{e(meta['cargo']).upper()}<b>{e(meta['curso']).upper()}</b></div></div>
  <div class="pilares"><i></i><i></i><i></i><b></b></div>
  <div class="capa-meio">
    <div class="capa-kicker">{e(meta['materia']).upper()} · ETAPA {e(meta['etapa'])} DE {e(meta['total'])}</div>
    <h1>{e(meta['titulo'])}</h1>
    <p class="capa-sub">{e(meta['assunto'])}</p>
    <div class="capa-cards">
      <div class="cc"><div class="cc-t">● Nesta etapa</div><ul>{''.join('<li>' + inline(o) + '</li>' for o in objetivos)}</ul></div>
      <div class="cc ficha"><div class="cc-t">● Ficha técnica</div>
        <div class="fl"><span>Assunto</span><b>{e(meta['assunto'])}</b></div>
        <div class="fl"><span>Etapa</span><b>{e(meta['etapa'])} de {e(meta['total'])}</b></div>
        <div class="fl"><span>Tempo de estudo</span><b>≈ {e(meta['tempo'])} min</b></div>
        <div class="fl"><span>Checkpoints</span><b>{len(cps)} {'item' if len(cps) == 1 else 'itens'}</b></div></div>
    </div>
  </div>
  <div class="legenda"><span><i class="d doc"></i>Documento</span><span><i class="d sala"></i>Na sala de aula</span><span><i class="d peg"></i>Pegadinha da banca</span><span><i class="d mac"></i>Macete</span><span><i class="d cpk"></i>Checkpoint</span></div>
  <div class="capa-pe"><b>ESTUDE · EVOLUA · CONQUISTE</b><span>Material de estudo TAOS Educação · uso individual do aluno</span></div>
</section>'''
    sumario = '<section class="pag"><h2 class="tit-pag">Plano de estudo</h2><div class="kick">Sumário da etapa</div><div class="sum">' + ''.join(
        f'<div class="sum-l"><span class="n">{k+1:02d}</span><span><b>{e(s["t"])}</b><small>{e(s["s"])}</small></span></div>' for k, s in enumerate(secoes)
    ) + f'''<div class="sum-l"><span class="n">✓</span><span><b>Gabarito comentado</b><small>Os {len(cps)} checkpoints desta etapa</small></span></div></div>
<div class="caixa box-atencao"><div class="cx-h"><span class="ic">i</span>Como estudar esta etapa</div>
<p>Este material corresponde à etapa {e(meta['etapa'])} do assunto {e(meta['assunto'])} no seu plano de estudos. Leia com lápis na mão e faça as próprias anotações nas margens. Os quadros em cor de areia trazem o texto da lei; os verdes mostram a regra aplicada no dia a dia da escola; os vermelhos apontam onde a banca costuma confundir o candidato.</p><p>Quando chegar a um checkpoint, responda antes de continuar a leitura. O gabarito comentado está no fim. Depois de terminar, marque a etapa como concluída na plataforma TAOS para que as revisões de 1, 7, 15 e 30 dias entrem no seu plano.</p></div></section>'''
    corpo_html = ''.join(
        f'<section class="sec"><div class="sec-h"><span class="sec-n">{k+1:02d}</span><div><h2>{e(s["t"])}</h2><div class="kick">{e(s["s"])}</div></div></div>{"".join(s["html"])}</section>'
        for k, s in enumerate(secoes))
    gab = ('<section class="sec gab"><div class="sec-h"><span class="sec-n">✓</span><div><h2>Gabarito comentado</h2><div class="kick">Checkpoints desta etapa</div></div></div>'
           '<div class="gab-grade">' + ''.join(f'<div><small>CP {n}</small><b>{e(l)}</b></div>' for n, l, _ in cps) + '</div>'
           '<table class="gab-t"><thead><tr><th>CP</th><th>Por quê</th></tr></thead><tbody>' +
           ''.join(f'<tr><td><b>{n}</b> · {e(l)}</td><td>{inline(p)}</td></tr>' for n, l, p in cps) + '</tbody></table></section>')
    rodape = 'Material TAOS Educação · %s · uso individual do aluno' % meta.get('rodape', 'Professor SEEDF · Pedagogia')
    css = CSS.replace('__CABECA__', cabeca.replace('"', '\\"')).replace('__RODAPE__', rodape)
    return f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>{e(meta['titulo'])} · TAOS Educação</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=block" rel="stylesheet">
<style>{css}</style></head><body>{capa}{sumario}{corpo_html}{gab}</body></html>'''

LOGO = '<svg viewBox="0 0 90 90" fill="currentColor" aria-hidden="true"><rect width="90" height="14"/><rect x="24" y="22" width="10" height="68"/><rect x="40" y="22" width="10" height="68"/><rect x="56" y="22" width="10" height="68"/></svg>'

def paginas(pdf):
    return len(re.findall(rb'/Type\s*/Page[^s]', open(pdf, 'rb').read()))

def gerar(caminho):
    meta, texto = ler(caminho)
    secoes, cps = montar(meta, texto)
    pasta = os.path.join(RAIZ, 'qg', 'cursos', PASTA_CURSO[meta['id'].split('-')[0]])
    destino = os.path.join(pasta, meta['id'] + '.pdf')
    with tempfile.TemporaryDirectory() as tmp:
        h = os.path.join(tmp, meta['id'] + '.html')
        open(h, 'w', encoding='utf-8').write(html_aula(meta, secoes, cps))
        if os.environ.get('SO_HTML'):
            import shutil; shutil.copy(h, os.environ['SO_HTML']); print('HTML em', os.environ['SO_HTML']); return
        subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=15000',
                        '--print-to-pdf=' + destino, 'file://' + h], check=True, capture_output=True)
    print('%-45s %2d páginas  %2d checkpoints' % (meta['id'], paginas(destino), len(cps)))

if __name__ == '__main__':
    pasta = os.path.join(AQUI, 'aulas')
    alvos = sys.argv[1:] or [f[:-5] for f in sorted(os.listdir(pasta)) if f.endswith('.aula')]
    for a in alvos:
        gerar(os.path.join(pasta, a + '.aula'))
