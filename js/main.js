// Olistika Academy — menu su telefono, modulo contatti (Google Moduli + WhatsApp), eventi per Google Ads
(function () {
  var WA = '393939652131';

  // Modulo Google «Olistika Academy - Richieste dal sito»: ogni invio finisce nel foglio collegato.
  var GFORM = 'https://docs.google.com/forms/d/e/1FAIpQLSccesP1CTvTOHEjVjeleKKD11FR_J-CQ7mybtJ830g1-MPYVA/formResponse';
  var CAMPI = {
    nome: 'entry.1241177489',
    telefono: 'entry.636780362',
    email: 'entry.919125056',
    interesse: 'entry.863391338',
    consenso: 'entry.1585270968',
    pagina: 'entry.2067153452',
    messaggio: 'entry.1564554205'
  };

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
  if (!form) return;
  var esito = form.querySelector('.form-esito');
  var invia = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.sito_web.value) return; // campo trappola: lo compilano solo i robot
    var dati = new URLSearchParams();
    dati.append(CAMPI.nome, form.nome.value.trim());
    dati.append(CAMPI.telefono, form.telefono.value.trim());
    dati.append(CAMPI.email, form.email.value.trim());
    dati.append(CAMPI.interesse, form.interesse.value);
    dati.append(CAMPI.messaggio, form.messaggio.value.trim());
    dati.append(CAMPI.consenso, 'Sì, ' + new Date().toLocaleString('it-IT'));
    dati.append(CAMPI.pagina, location.pathname.split('/').pop() || 'index.html');

    invia.disabled = true;
    invia.textContent = 'Invio in corso…';
    fetch(GFORM, { method: 'POST', mode: 'no-cors', body: dati })
      .then(function () {
        track('contatto_modulo', { interesse: form.interesse.value, page: location.pathname });
        form.classList.add('inviato');
        esito.textContent = 'Grazie ' + form.nome.value.trim() + ', richiesta ricevuta. Ti ricontattiamo al più presto.';
        esito.hidden = false;
      })
      .catch(function () {
        invia.disabled = false;
        invia.textContent = 'Invia la richiesta';
        esito.textContent = 'Non siamo riusciti a inviare la richiesta. Riprova, oppure scrivici su WhatsApp al 393 965 2131.';
        esito.hidden = false;
      });
  });

  // In alternativa: stesso messaggio, ma su WhatsApp.
  var viaWa = form.querySelector('.via-wa');
  if (viaWa) {
    viaWa.addEventListener('click', function () {
      var nome = form.nome.value.trim();
      var text = 'Ciao Manuela' + (nome ? ', sono ' + nome : '') + '. Vorrei informazioni su: ' + form.interesse.value + '.';
      var msg = form.messaggio.value.trim();
      if (msg) text += '\n' + msg;
      track('contatto_whatsapp', { interesse: form.interesse.value, page: location.pathname });
      window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    });
  }
})();
