/* TAOS · funções compartilhadas da área do aluno (login, divisões, cursos e painel) */
(function () {
  var cfg = window.QG_CONFIG || {};
  var T = window.TAOS = {};
  T.demo = !(cfg.supabaseUrl && cfg.supabaseKey && window.supabase);
  T.sb = T.demo ? null : window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey);
  T.cursos = window.TAOS_CURSOS;
  T.ordem = window.TAOS_ORDEM;
  T.divs = window.TAOS_DIVISOES;
  T.divOrdem = window.TAOS_DIV_ORDEM;

  T.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  T.$ = function (s) { return document.querySelector(s); };

  T.logo = '<span class="logo"><svg viewBox="0 0 90 90" fill="currentColor" aria-hidden="true"><rect width="90" height="14"/><rect x="24" y="22" width="10" height="68"/><rect x="40" y="22" width="10" height="68"/><rect x="56" y="22" width="10" height="68"/></svg><span class="sep"></span><span><b>TAOS</b><i>ÁREA DO ALUNO</i></span></span>';

  // Ícones das divisões (traço, 32×32)
  var IC = {
    escudo: '<path d="M16 3l11 4v8c0 7-5 11-11 14C10 26 5 22 5 15V7z"/><path d="M16 10l2 4 4.5.6-3.3 3 .8 4.4-4-2.2-4 2.2.8-4.4-3.3-3 4.5-.6z"/>',
    cruz: '<path d="M12 4h8v8h8v8h-8v8h-8v-8H4v-8h8z"/>',
    capelo: '<path d="M3 11l13-6 13 6-13 6z"/><path d="M9 14v6c0 2 3.5 3.5 7 3.5s7-1.5 7-3.5v-6"/><path d="M29 11v8"/>',
    livro: '<path d="M4 7h10c1.5 0 2 1 2 2v17c0-1-.8-2-2-2H4z"/><path d="M28 7H18c-1.5 0-2 1-2 2v17c0-1 .8-2 2-2h10z"/>'
  };
  T.icone = function (nome) {
    return '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true">' + (IC[nome] || IC.livro) + '</svg>';
  };
  T.divDe = function (c) { return T.divs[c.divisao] || T.divs.militar; };

  T.cena = function () {
    var el = document.createElement('div');
    el.className = 'scene';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<div class="glow"></div><div class="glow g2"></div><div class="grid"></div><div class="scanline"></div>';
    document.body.prepend(el);
  };

  // Variáveis de cor do card de cada curso
  T.vars = function (c) {
    var t = c.tema;
    return '--cbg:linear-gradient(160deg,' + t.hero2 + ',' + t.bg + ');--cacc:' + t.acc + ';--cacc-a:rgba(' + t['acc-rgb'] + ',.35);--cink:' + t['acc-ink'] + ';--cgold:' + t.gold;
  };
  T.divVars = function (d) { return '--dcor:' + d.cor + ';--drgb:' + d.corRgb + ';--dtinta:' + d.tinta; };

  T.toast = function (txt) {
    var t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = txt; t.classList.add('on');
    clearTimeout(T._tt); T._tt = setTimeout(function () { t.classList.remove('on'); }, 2600);
  };

  T.copiar = function (txt, btn) {
    function ok() { T.toast('Copiado'); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(ok, function () { T.selecionar(btn); });
    } else T.selecionar(btn);
  };
  T.selecionar = function (btn) {
    var pre = btn && btn.closest('.result') && btn.closest('.result').querySelector('pre');
    if (!pre) return;
    var r = document.createRange(); r.selectNodeContents(pre);
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    T.toast('Texto selecionado: copie com Ctrl+C');
  };

  T.iniciais = function (nome) {
    return String(nome || '?').split(/[\s._@-]+/).filter(Boolean).slice(0, 2).map(function (p) { return p[0].toUpperCase(); }).join('');
  };

  T.isAdmin = async function () {
    if (T.demo) return true;
    var r = await T.sb.rpc('is_admin');
    return !!r.data;
  };
})();
