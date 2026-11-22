/* TAOS Militar · funções compartilhadas do QG (login, cursos e painel) */
(function () {
  var cfg = window.QG_CONFIG || {};
  var T = window.TAOS = {};
  T.demo = !(cfg.supabaseUrl && cfg.supabaseKey && window.supabase);
  T.sb = T.demo ? null : window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseKey);
  T.cursos = window.TAOS_CURSOS;
  T.ordem = window.TAOS_ORDEM;

  T.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  T.$ = function (s) { return document.querySelector(s); };

  T.logo = '<span class="logo"><svg viewBox="0 0 90 90" fill="currentColor" aria-hidden="true"><rect width="90" height="14"/><rect x="24" y="22" width="10" height="68"/><rect x="40" y="22" width="10" height="68"/><rect x="56" y="22" width="10" height="68"/></svg><span class="sep"></span><span><b>TAOS</b><i>MILITAR</i></span></span>';

  T.cena = function () {
    var blips = [[30, 40, 0], [62, 28, 1.2], [44, 70, 2.4], [74, 60, 3.3]].map(function (b) {
      return '<i class="blip" style="left:' + b[0] + '%;top:' + b[1] + '%;animation-delay:' + b[2] + 's"></i>';
    }).join('');
    var el = document.createElement('div');
    el.className = 'scene';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<div class="glow"></div><div class="grid"></div><div class="scanline"></div><div class="stars"><i></i><i></i><i></i></div><div class="radar"><div class="sweep"></div>' + blips + '</div>';
    document.body.prepend(el);
  };

  // Variáveis de cor do card de cada curso
  T.vars = function (c) {
    var t = c.tema;
    return '--cbg:linear-gradient(160deg,' + t.hero2 + ',' + t.bg + ');--cacc:' + t.acc + ';--cacc-a:rgba(' + t['acc-rgb'] + ',.35);--cink:' + t['acc-ink'] + ';--cgold:' + t.gold;
  };

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
