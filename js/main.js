// Olistika Academy — menu su telefono, modulo che apre WhatsApp, eventi per Google Ads
(function () {
  var WA = '393939652131';

  // Quando sul sito ci sarà il tag di Google, ogni contatto viene contato come conversione.
  function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') nav.classList.remove('open');
    });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-track]');
    if (a) track(a.getAttribute('data-track'), { page: location.pathname });
  });

  var form = document.querySelector('#modulo-contatto');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = form.nome.value.trim();
      var interesse = form.interesse.value;
      var msg = form.messaggio.value.trim();
      var text = 'Ciao Manuela, sono ' + nome + '. Vorrei informazioni su: ' + interesse + '.';
      if (msg) text += '\n' + msg;
      track('contatto_modulo_whatsapp', { interesse: interesse, page: location.pathname });
      window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    });
  }
})();
