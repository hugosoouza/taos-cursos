/* TAOS · botão de "olho" para mostrar/esconder a senha.
   Funciona sozinho: qualquer campo de senha que aparecer na página ganha o botão. */
(function () {
  var ABERTO = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  var FECHADO = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.6 5.1A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-2.6 3.6M6.6 6.6C3.7 8.4 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/><path d="M2 2l20 20"/></svg>';

  var css = document.createElement('style');
  css.textContent =
    '.olho-wrap{position:relative;display:block;width:100%}' +
    '.olho-wrap>input{width:100%;padding-right:48px!important;box-sizing:border-box}' +
    '.olho-btn{position:absolute;top:50%;right:6px;transform:translateY(-50%);width:38px;height:38px;display:grid;place-items:center;' +
    'background:none;border:0;border-radius:8px;color:inherit;opacity:.6;cursor:pointer;padding:0}' +
    '.olho-btn:hover,.olho-btn:focus-visible{opacity:1}' +
    '.olho-btn:focus-visible{outline:2px solid currentColor;outline-offset:1px}';
  document.head.appendChild(css);

  function preparar(inp) {
    if (inp.dataset.olho) return;
    inp.dataset.olho = '1';
    var wrap = document.createElement('span');
    wrap.className = 'olho-wrap';
    inp.parentNode.insertBefore(wrap, inp);
    wrap.appendChild(inp);
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'olho-btn';
    function pintar() {
      var visivel = inp.type === 'text';
      b.innerHTML = visivel ? FECHADO : ABERTO;
      b.setAttribute('aria-label', visivel ? 'Esconder senha' : 'Mostrar senha');
      b.title = visivel ? 'Esconder senha' : 'Mostrar senha';
    }
    b.onclick = function () {
      inp.type = inp.type === 'password' ? 'text' : 'password';
      pintar();
      inp.focus();
    };
    pintar();
    wrap.appendChild(b);
  }

  function varrer(raiz) {
    (raiz.querySelectorAll ? raiz : document).querySelectorAll('input[type=password]:not([data-olho])').forEach(preparar);
  }

  new MutationObserver(function () { varrer(document); })
    .observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { varrer(document); });
  else varrer(document);
})();
