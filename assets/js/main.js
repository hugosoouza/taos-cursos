(function () {
  var cfg = window.TAOS_CONFIG;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function waLink(texto) {
    return "https://wa.me/" + cfg.whatsapp + "?text=" + encodeURIComponent(texto);
  }
  function msgMentoria(sigla, nome) {
    var m = cfg.mentorias.filter(function (x) { return x.sigla === sigla; })[0] || {};
    return (nome ? "Olá! Meu nome é " + nome + ". " : "Olá! ") + "Quero comprar a mentoria para " + (m.artigo || "a") + " " + sigla + ".";
  }

  // Links gerais
  $$("[data-wa='geral']").forEach(function (a) { a.href = waLink(cfg.mensagemGeral); });

  // Topbar
  var topbar = $("#topbar");
  if (topbar) {
    try { if (sessionStorage.getItem("taos-topbar") === "x") topbar.hidden = true; } catch (e) {}
    $("#topbar-x").addEventListener("click", function () {
      topbar.hidden = true;
      try { sessionStorage.setItem("taos-topbar", "x"); } catch (e) {}
    });
  }

  // Header sólido ao rolar
  var head = $("#head");
  function onScroll() {
    if (head && !document.body.classList.contains("auth-page")) head.classList.toggle("solid", window.scrollY > 40);
    updateTimeline();
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  // Menu mobile
  var burger = $("#burger"), nav = $("#nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    $$("a", nav).forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  // Palavra que gira no título
  var rot = $("#rotator");
  var palavras = cfg.destaques && cfg.destaques.length ? cfg.destaques : cfg.mentorias.map(function (m) { return "na " + m.sigla; });
  if (rot) rot.firstElementChild.textContent = palavras[0];
  if (rot && palavras.length > 1 && !reduce) {
    var i = 0;
    setInterval(function () {
      var cur = rot.firstElementChild;
      cur.classList.add("out");
      setTimeout(function () {
        i = (i + 1) % palavras.length;
        rot.innerHTML = '<span class="in">' + palavras[i] + "</span>";
      }, 320);
    }, 2600);
  }

  // Faixa animada
  var mq = $("#marquee");
  if (mq) {
    var words = (cfg.areas || []).map(function (a) { return a.nome; });
    cfg.mentorias.forEach(function (m) { words.push(m.sigla); });
    words = words.concat(["Estude", "Evolua", "Conquiste"]);
    var html = words.map(function (w) { return "<span>" + w + "</span>"; }).join("");
    mq.innerHTML = html + html + html + html;
  }

  // Select do formulário
  var sel = $("#f-concurso");
  function grupoOpt(rotulo, itens) {
    var g = document.createElement("optgroup"); g.label = rotulo;
    itens.forEach(function (it) { var o = document.createElement("option"); o.value = it[0]; o.textContent = it[1]; g.appendChild(o); });
    sel.appendChild(g);
  }
  if (sel) {
    grupoOpt("Mentorias com turma aberta", cfg.mentorias.map(function (m) { return ["m:" + m.sigla, m.sigla + " · " + m.nome]; }));
    grupoOpt("Outras áreas", (cfg.areas || []).map(function (a) { return ["a:" + a.id, a.nome]; }));
  }
  function areaPorId(id) { return (cfg.areas || []).filter(function (a) { return a.id === id; })[0]; }
  function msgArea(a, nome) {
    return (nome ? "Olá! Meu nome é " + nome + ". " : "Olá! ") + "Tenho interesse nos cursos de " + a.nome + " da TAOS.";
  }

  // Formulário → WhatsApp
  var form = $("#inscricao");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nome = $("#f-nome").value.trim();
      var conc = sel.value;
      var err = $("#form-err");
      $$(".field", form).forEach(function (f) { f.classList.remove("bad"); });
      var faltando = [];
      if (!nome) { faltando.push("seu nome"); $("#f-nome").parentNode.classList.add("bad"); }
      if (!conc) { faltando.push("o concurso"); sel.parentNode.classList.add("bad"); }
      if (faltando.length) {
        err.textContent = "Falta preencher " + faltando.join(" e ") + ".";
        err.hidden = false;
        return;
      }
      err.hidden = true;
      var texto = conc.indexOf("a:") === 0 ? msgArea(areaPorId(conc.slice(2)), nome) : msgMentoria(conc.slice(2), nome);
      window.open(waLink(texto), "_blank", "noopener");
    });
  }

  // Cards de mentoria
  var grid = $("#mgrid");
  if (grid) {
    grid.innerHTML = cfg.mentorias.map(function (m, idx) {
      var tipo = m.grupo || "";
      return (
        '<article class="mcard" data-reveal style="--d:' + idx * 0.08 + 's" data-grupo="' + (m.grupo || "") + '" id="mentoria-' + m.sigla.toLowerCase() + '">' +
          '<div class="m-top"><span class="uf" aria-hidden="true">' + m.uf + '</span><span class="m-tag">' + tipo + '</span>' +
          '<h3 class="m-sigla">' + m.sigla + '</h3><p class="m-nome">' + m.nome + "</p></div>" +
          '<div class="m-body"><p>' + m.resumo + "</p>" +
            '<div class="m-chips"><span>Online</span><span>Em turma</span><span>Até a prova</span></div>' +
            '<button class="m-more" aria-expanded="false" aria-controls="inc-' + idx + '">O que está incluso</button>' +
            '<ul class="m-inc" id="inc-' + idx + '">' + cfg.incluso.map(function (t) { return '<li><svg class="ico"><use href="#i-check"/></svg>' + t + "</li>"; }).join("") + "</ul>" +
            '<a class="btn btn-wa btn-block" target="_blank" rel="noopener" href="' + waLink(msgMentoria(m.sigla)) + '"><svg class="ico"><use href="#i-wa"/></svg>Quero a mentoria ' + m.sigla + "</a>" +
          "</div></article>"
      );
    }).join("");
    $$(".m-more", grid).forEach(function (b) {
      b.addEventListener("click", function () {
        var list = document.getElementById(b.getAttribute("aria-controls"));
        var open = list.classList.toggle("open");
        b.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  // Áreas
  var agrid = $("#agrid");
  if (agrid) {
    var icones = {
      vestibular: '<path d="M4 9l12-5 12 5-12 5z"/><path d="M9 12v6c0 2 3.5 3.5 7 3.5s7-1.5 7-3.5v-6"/><path d="M28 9v8"/>',
      militar: '<path d="M16 3l11 4v8c0 7-5 11-11 14C10 26 5 22 5 15V7z"/><path d="M16 10l2 4 4.5.6-3.3 3 .8 4.4-4-2.2-4 2.2.8-4.4-3.3-3 4.5-.6z"/>',
      saude: '<path d="M12 4h8v8h8v8h-8v8h-8v-8H4v-8h8z"/>',
      educacao: '<path d="M4 7h10c1.5 0 2 1 2 2v17c0-1-.8-2-2-2H4z"/><path d="M28 7H18c-1.5 0-2 1-2 2v17c0-1 .8-2 2-2h10z"/>',
      outros: '<rect x="5" y="9" width="22" height="16" rx="2"/><path d="M12 9V6h8v3M5 16h22"/>'
    };
    agrid.innerHTML = (cfg.areas || []).map(function (a, idx) {
      var n = cfg.mentorias.filter(function (m) { return m.area === a.id; }).length;
      var acao = n
        ? '<a class="a-link" href="#mentorias">Ver ' + n + (n === 1 ? " mentoria aberta" : " mentorias abertas") + ' <svg class="ico"><use href="#i-arrow"/></svg></a>'
        : '<a class="a-link" target="_blank" rel="noopener" href="' + waLink(msgArea(a)) + '">Quero saber das turmas <svg class="ico"><use href="#i-arrow"/></svg></a>';
      return '<article class="acard' + (n ? " on" : "") + '" data-reveal style="--d:' + idx * 0.06 + 's">' +
        '<svg class="a-ico" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true">' + (icones[a.id] || icones.outros) + "</svg>" +
        (n ? '<span class="a-badge">Turma aberta</span>' : "") +
        "<h3>" + a.nome + "</h3><p>" + a.texto + "</p>" + acao + "</article>";
    }).join("");
  }

  // Filtros: um botão para cada grupo de mentorias
  var fbox = $(".filters");
  if (fbox) {
    var grupos = [];
    cfg.mentorias.forEach(function (m) { if (m.grupo && grupos.indexOf(m.grupo) < 0) grupos.push(m.grupo); });
    grupos.forEach(function (g) { fbox.insertAdjacentHTML("beforeend", '<button class="f-btn" data-f="' + g + '" role="tab" aria-selected="false">' + g + "</button>"); });
    if (grupos.length < 2) fbox.hidden = true;
  }
  $$(".f-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      $$(".f-btn").forEach(function (x) { x.classList.remove("on"); x.setAttribute("aria-selected", "false"); });
      b.classList.add("on"); b.setAttribute("aria-selected", "true");
      var f = b.getAttribute("data-f");
      $$(".mcard").forEach(function (c) {
        c.classList.toggle("hide", f !== "todas" && c.getAttribute("data-grupo") !== f);
      });
    });
  });

  // Headline: separa as palavras para animar uma a uma
  var nW = 0;
  $$("[data-split]").forEach(function (bloco) {
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (ch) {
        if (ch.nodeType === 1) return walk(ch);
        if (ch.nodeType !== 3 || !ch.textContent.trim()) return;
        var frag = document.createDocumentFragment();
        ch.textContent.split(/(\s+)/).forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(" ")); return; }
          var wm = document.createElement("span"); wm.className = "wm";
          var w = document.createElement("span"); w.className = "w"; w.style.setProperty("--i", nW++); w.textContent = p;
          wm.appendChild(w); frag.appendChild(wm);
        });
        node.replaceChild(frag, ch);
      });
    })(bloco);
  });

  // Foco cirúrgico: lista as provas com turma aberta
  var sig = $("#dor-siglas");
  if (sig && cfg.mentorias && cfg.mentorias.length) {
    var ss = cfg.mentorias.map(function (m) { return m.sigla; });
    sig.textContent = ss.length > 1 ? ss.slice(0, -1).join(", ") + " e " + ss[ss.length - 1] : ss[0];
  }

  // Prévia da plataforma (dados de exemplo)
  var PV = {
    enem: { rot: "ENEM", sub: "Vestibular", cor: "#8f9bff", marca: "ENEM", ola: "Bons estudos, Ana!", foco: "foco total no ENEM", faltam: 347,
      pat: "Focado", prox: "Avançado", xp: [2980, 5000],
      vars: { pbg: "#0b0a1f", psf: "#15132e", psf2: "#100e25", pline: "#24224a", pink: "#eceefe", pmut: "#9a9cc4", pacc: "#8f9bff", paccink: "#0b0f33", pgold: "#ffd166", pside: "#07061a" },
      etapas: [["Matemática", "#8f9bff", "Função afim", 40], ["Redação", "#ff8fa3", "Repertório sociocultural", 40], ["Biologia", "#4ade80", "Relações ecológicas", 40], ["Matemática", "#8f9bff", "Exercícios: Funções", 35]],
      st: [["12", "dias seguidos"], ["78%", "acertos em 7 dias"], ["4", "revisões para hoje"]], q: [40, 65, 30, 80, 55, 90, 70] },
    pmdf: { rot: "PMDF", sub: "Militar", cor: "#4f8ff0", marca: "MILITAR", ola: "Bom serviço, Ana!", foco: "foco total na PMDF", faltam: 128,
      pat: "Cabo", prox: "3º Sargento", xp: [1640, 2500],
      vars: { pbg: "#070c17", psf: "#0e1628", psf2: "#0a111f", pline: "#1d2940", pink: "#e7ecf6", pmut: "#8d99b0", pacc: "#4f8ff0", paccink: "#ffffff", pgold: "#d6a630", pside: "#050913" },
      etapas: [["Português", "#4f8ff0", "Concordância nominal e verbal", 50], ["Constitucional", "#d6a630", "Direitos e garantias fundamentais", 45], ["Legislação da PMDF", "#4ade80", "Lei Orgânica do DF", 40], ["Direito Penal", "#ff8fa3", "Teoria geral do crime", 45]],
      st: [["21", "dias seguidos"], ["82%", "acertos em 7 dias"], ["6", "revisões para hoje"]], q: [60, 45, 85, 70, 95, 50, 75] }
  };
  var pvWin = $("#pv-win"), pvTabs = $("#pv-tabs"), pvRoot = $(".pv");
  if (pvWin && pvTabs) {
    var ckIco = '<svg viewBox="0 0 16 16"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2.6"/></svg>';
    var menu = ["Dashboard", "Metas da semana", "Conteúdos", "Revisões", "Questões", "Desempenho", "Simulados", "Flashcards"];
    var atual = "enem", feitos = {};
    pvTabs.innerHTML = Object.keys(PV).map(function (k) {
      var c = PV[k];
      return '<button class="pv-tab" role="tab" id="pvt-' + k + '" aria-controls="pv-win" data-k="' + k + '" style="--c:' + c.cor + '"><i></i>' + c.rot + ' <small>' + c.sub + '</small></button>';
    }).join("");
    var pvProg = function () {
      var c = PV[atual], n = $$(".pv-etapa.ok", pvWin).length, tot = c.etapas.length;
      $("#pv-feito").textContent = n + " de " + tot + " concluídas";
      $("#pv-bar").style.setProperty("--p", (n / tot * 100) + "%");
      var xp = c.xp[0] + n * 40;
      $("#pv-xpn").textContent = xp.toLocaleString("pt-BR") + " / " + c.xp[1].toLocaleString("pt-BR") + " XP";
      $("#pv-xpb").style.setProperty("--p", (xp / c.xp[1] * 100) + "%");
    };
    var pvRender = function () {
      var c = PV[atual];
      feitos[atual] = feitos[atual] || {};
      Object.keys(c.vars).forEach(function (v) { pvRoot.style.setProperty("--" + v, c.vars[v]); });
      $$(".pv-tab", pvTabs).forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-k") === atual ? "true" : "false"); });
      pvWin.setAttribute("aria-labelledby", "pvt-" + atual);
      var dias = ["S", "T", "Q", "Q", "S", "S", "D"];
      pvWin.innerHTML =
        '<div class="pv-bar" aria-hidden="true"><i></i><i></i><i></i><span class="pv-url">taos · área do aluno · ' + c.rot + '</span></div>' +
        '<div class="pv-app pv-swap">' +
          '<nav class="pv-side" aria-hidden="true"><span class="pv-brand"><svg viewBox="0 0 90 90" fill="currentColor"><rect width="90" height="14"/><rect x="24" y="22" width="10" height="68"/><rect x="40" y="22" width="10" height="68"/><rect x="56" y="22" width="10" height="68"/></svg><span>TAOS<small>' + c.marca + '</small></span></span>' +
            menu.map(function (m, i) { return '<span class="pv-nav' + (i ? "" : " on") + '">' + m + '</span>'; }).join("") + '</nav>' +
          '<div class="pv-main">' +
            '<div class="pv-head"><div><h3>' + c.ola + '</h3><p>Segunda-feira · ' + c.foco + '</p></div><div class="pv-count"><b>' + c.faltam + ' dias</b><span>até a prova</span></div></div>' +
            '<div class="pv-stats">' + c.st.map(function (s) { return '<div class="pv-stat"><b>' + s[0] + '</b><span>' + s[1] + '</span></div>'; }).join("") + '</div>' +
            '<div class="pv-grid">' +
              '<div class="pv-card"><h4>Seu plano de hoje <span id="pv-feito"></span></h4><div class="pv-prog"><i id="pv-bar"></i></div>' +
                c.etapas.map(function (e, i) {
                  return '<button type="button" class="pv-etapa' + (feitos[atual][i] ? " ok" : "") + '" data-i="' + i + '" aria-pressed="' + (feitos[atual][i] ? "true" : "false") + '">' +
                    '<span class="pv-ck">' + ckIco + '</span><span class="pv-et"><b>' + e[2] + '</b><small><i style="--m:' + e[1] + '"></i>' + e[0] + '</small></span><span class="pv-min">' + e[3] + ' min</span></button>';
                }).join("") + '</div>' +
              '<div class="pv-card"><h4>Seu nível</h4><div class="pv-pat"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M16 3l11 4v8c0 7-5 11-11 14C10 26 5 22 5 15V7z"/><path d="M16 10l2 4 4.5.6-3.3 3 .8 4.4-4-2.2-4 2.2.8-4.4-3.3-3 4.5-.6z"/></svg><div><b>' + c.pat + '</b><small>próximo: ' + c.prox + '</small></div></div>' +
                '<div class="pv-xp"><span class="pv-et"><small id="pv-xpn"></small></span><div class="pv-prog"><i id="pv-xpb"></i></div></div>' +
                '<h4 style="margin-top:14px">Questões por dia</h4><div class="pv-chart" aria-hidden="true">' + c.q.map(function (h, k) { return '<i style="--h:' + h + '%;--k:' + k + '"></i>'; }).join("") + '</div>' +
                '<div class="pv-days" aria-hidden="true">' + dias.map(function (d) { return '<span>' + d + '</span>'; }).join("") + '</div></div>' +
            '</div>' +
          '</div>' +
        '</div>';
      pvProg();
    };
    pvTabs.addEventListener("click", function (e) {
      var b = e.target.closest(".pv-tab"); if (!b || b.getAttribute("data-k") === atual) return;
      atual = b.getAttribute("data-k"); pvRender();
    });
    pvWin.addEventListener("click", function (e) {
      var b = e.target.closest(".pv-etapa"); if (!b) return;
      var i = b.getAttribute("data-i"), on = !b.classList.contains("ok");
      b.classList.toggle("ok", on); b.setAttribute("aria-pressed", on ? "true" : "false");
      feitos[atual][i] = on; pvProg();
    });
    pvRender();
    // Quando a prévia aparece na tela, marca a primeira etapa sozinha
    if ("IntersectionObserver" in window && !reduce) {
      var pio = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting) return; pio.disconnect();
        setTimeout(function () { var b = $(".pv-etapa:not(.ok)", pvWin); if (b && !Object.keys(feitos[atual]).length) b.click(); }, 1100);
      }, { threshold: 0.4 });
      pio.observe(pvWin);
    }
  }

  // Revelar ao rolar
  var items = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  // Linha do tempo que enche
  var tl = $("#timeline"), fill = $("#tl-fill");
  function updateTimeline() {
    if (!tl || !fill) return;
    var r = tl.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = (vh * 0.85 - r.top) / (r.height + vh * 0.3);
    fill.style.width = Math.max(0, Math.min(1, p)) * 100 + "%";
  }

  var ano = $("#ano");
  if (ano) ano.textContent = new Date().getFullYear();

  // Dados da empresa (rodapé e páginas legais)
  var emp = cfg.empresa || {};
  var linha = [emp.razaoSocial || emp.nome, emp.cnpj ? "CNPJ " + emp.cnpj : "", emp.endereco, emp.email].filter(Boolean).join(" · ");
  var ed = $("#empresa-dados");
  if (ed) { ed.textContent = linha; ed.hidden = !linha; }
  $$("[data-emp]").forEach(function (el) {
    var k = el.getAttribute("data-emp");
    var v = k === "whatsapp" ? "+" + cfg.whatsapp.replace(/^(\d{2})(\d{2})(\d{5})(\d{4})$/, "$1 ($2) $3-$4") : emp[k];
    if (v) el.textContent = v; else if (el.hasAttribute("data-opcional")) el.closest("[data-linha]") ? el.closest("[data-linha]").remove() : el.remove();
  });

  // Aviso de cookies (só informativo: o site não usa rastreamento)
  var ck = $("#cookie");
  if (ck) {
    var visto = false;
    try { visto = localStorage.getItem("taos-cookie") === "ok"; } catch (e) {}
    if (!visto) ck.hidden = false;
    $("#cookie-ok").addEventListener("click", function () {
      ck.hidden = true;
      try { localStorage.setItem("taos-cookie", "ok"); } catch (e) {}
    });
  }
  onScroll();
})();
