/* RakeLink scripts: services list, dashboard charts, tracking, enquiry form, bill generator. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  function el(t, x, c) { var e = document.createElement(t); if (x != null) e.textContent = x; if (c) e.className = c; return e; }
  var SERVICES = [
    { id: 'fwl', name: 'Full wagon load', desc: 'One wagon of about 60 tonnes between any two goods sheds or sidings.', unit: 'wagon', rate: 35000, note: 'about 400 km' },
    { id: 'pl', name: 'Part load', desc: 'For shipments under 10 tonnes. Your cargo shares a wagon with others on the same lane.', unit: 'tonne', rate: 1400 },
    { id: 'fr', name: 'Full rake', desc: 'A full train of about 58 wagons (around 3,500 tonnes) with a dedicated rake coordinator.', unit: 'rake', rate: 1600000, note: 'about 400 km' },
    { id: 'cr', name: 'Container by rail', desc: '20-ft and 40-ft containers between Mundra, JN Port and inland container depots.', unit: '20-ft container', rate: 20000 },
    { id: 'trk', name: 'First and last mile trucking', desc: 'Truck pickup from your plant to the siding and delivery from the destination terminal.', unit: 'km', rate: 45 },
    { id: 'doc', name: 'Tracking and documents', desc: 'Live status page, railway receipt handling and SMS alerts when a consignment is delayed.', unit: 'booking', rate: 500 },
    { id: 'cus', name: 'Other charge', unit: 'unit', rate: 0 }
  ];
  var svc = function (id) { return SERVICES.filter(function (s) { return s.id === id; })[0]; };
  var rs = function (p) { return '\u20B9' + (p / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };

  /* menu */
  $('menu').addEventListener('click', function () { var o = $('nav').classList.toggle('open'); this.setAttribute('aria-expanded', o); });
  $('nav').addEventListener('click', function (e) { if (e.target.tagName === 'A') { $('nav').classList.remove('open'); $('menu').setAttribute('aria-expanded', 'false'); } });

  /* services table and enquiry list */
  var sb = $('svcRows'), sel = $('eSvc');
  sel.appendChild(new Option('Choose a service', ''));
  SERVICES.slice(0, 6).forEach(function (s) {
    var tr = el('tr'), a = el('a', 'Book this service', 'btn'), b = el('td');
    tr.appendChild(el('td', s.name)); tr.appendChild(el('td', s.desc));
    var p = el('td', '\u20B9' + s.rate.toLocaleString('en-IN') + ' per ' + s.unit);
    if (s.note) p.appendChild(el('div', s.note, 'small'));
    tr.appendChild(p);
    a.href = '#contact'; a.setAttribute('data-s', s.id); b.appendChild(a); tr.appendChild(b);
    sb.appendChild(tr);
    sel.appendChild(new Option(s.name, s.id));
  });
  sb.addEventListener('click', function (e) { var s = e.target.getAttribute('data-s'); if (s) sel.value = s; });

  /* dashboard charts (sample data) */
  function bars(id, rows, suffix) {
    var box = $(id), max = Math.max.apply(null, rows.map(function (r) { return r[1]; }));
    rows.forEach(function (r) {
      var d = el('div', null, 'bar'), s = el('span'), i = el('i');
      i.style.width = (r[1] / max * 100) + '%'; s.appendChild(i);
      d.appendChild(el('div', r[0])); d.appendChild(s);
      d.appendChild(el('em', r[1].toLocaleString('en-IN') + (suffix || '')));
      box.appendChild(d);
    });
  }
  bars('cMonth', [['Apr', 980], ['May', 1040], ['Jun', 1105], ['Jul', 1170], ['Aug', 1210], ['Sep', 1250]]);
  bars('cMix', [['Coal', 38], ['Cement', 18], ['Steel', 16], ['Fertiliser', 12], ['Containers', 10], ['Other', 6]], '%');
  bars('cDelay', [['Terminal congestion', 18], ['Wagon shortage', 12], ['Paperwork', 8], ['Weather', 7], ['Other', 5]]);

  /* tracking (sample consignments) */
  var TRK = {
    TRK1018: { st: 'Delayed', cls: 'bad', pct: 55, route: 'Jamshedpur to Vadodara', cargo: 'Steel coils', qty: '3 wagons (about 180 tonnes)', at: 'Nagpur Junction yard', eta: '19 Oct 2026 (2 days late)', note: 'Held at the yard because of terminal congestion.' },
    TRK1025: { st: 'In transit', cls: 'warn', pct: 40, route: 'Korba to Surat', cargo: 'Coal', qty: '1 rake (about 3,500 tonnes)', at: 'Near Katni', eta: '17 Oct 2026', note: 'Running on time.' },
    TRK1001: { st: 'Delivered', cls: 'ok', pct: 100, route: 'Mundra to Dadri', cargo: 'Containers', qty: '12 x 20-ft containers', at: 'Dadri terminal', eta: 'Delivered 9 Oct 2026', note: 'Delivered by the promised date.' }
  };
  function track(id) {
    id = id.trim().toUpperCase();
    var box = $('tOut'), t = TRK[id];
    box.textContent = '';
    if (!id) { box.textContent = 'Enter a consignment ID to see its status.'; return; }
    if (!t) { box.textContent = 'No consignment found for ' + id + '. Check the ID on your booking confirmation or try a sample.'; return; }
    var h = el('p'), pr = el('div', null, 'prog'), i = el('i'), dl = el('dl', null, 'kv');
    h.style.margin = '0'; h.appendChild(el('span', t.st, 'badge ' + t.cls)); h.appendChild(document.createTextNode(' ' + id));
    i.style.width = t.pct + '%'; pr.appendChild(i); pr.setAttribute('role', 'img'); pr.setAttribute('aria-label', t.pct + ' percent of the journey complete');
    [['Route', t.route], ['Cargo', t.cargo], ['Quantity', t.qty], ['Last seen', t.at], ['Arrival', t.eta], ['Note', t.note]].forEach(function (r) { dl.appendChild(el('dt', r[0])); dl.appendChild(el('dd', r[1])); });
    box.appendChild(h); box.appendChild(pr); box.appendChild(dl);
  }
  $('tForm').addEventListener('submit', function (e) { e.preventDefault(); track($('tId').value); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('[data-id]') : null;
    if (a) { $('tId').value = a.getAttribute('data-id'); track(a.getAttribute('data-id')); }
  });

  /* enquiry form: sent to the owner's email through Web3Forms (works on any device).
     If sending fails, the visitor gets WhatsApp and email buttons instead. */
  var WEB3FORMS_KEY = 'c8cf1996-9aab-4169-bdda-44c438f4c79'; /* paste your full key from web3forms.com here */
  var OWNER_MAIL = 'jaikee.kumar_mba25@gsv.ac.in';
  var OWNER_WA = '917488991657';
  if (!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(WEB3FORMS_KEY)) { console.warn('RakeLink: the Web3Forms access key looks incomplete. Copy it again from your Web3Forms email.'); }

  function enqLinks(out, text, subject) {
    var box = el('div', null, 'btns'), w = el('a', 'Send on WhatsApp', 'btn amber'), m = el('a', 'Send by email', 'btn');
    w.href = 'https://wa.me/' + OWNER_WA + '?text=' + encodeURIComponent(text); w.target = '_blank'; w.rel = 'noopener';
    m.href = 'mailto:' + OWNER_MAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text);
    box.appendChild(w); box.appendChild(m); out.appendChild(box);
  }

  $('eForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var s = svc($('eSvc').value), sname = s ? s.name : '', out = $('emsg'), btn = this.querySelector('button[type=submit]'), form = this;
    var subject = 'Rail freight enquiry: ' + sname;
    var text = 'Rail freight enquiry\nName: ' + $('eName').value + '\nCompany: ' + $('eCo').value + '\nEmail: ' + $('eMail').value +
      '\nPhone: ' + $('ePhone').value + '\nService: ' + sname + '\n\n' + $('eMsg').value;
    if ($('eBot').checked) { out.textContent = 'Thank you. Your enquiry has been sent.'; return; }
    out.textContent = 'Sending your enquiry...'; btn.disabled = true;

    var data = { name: $('eName').value, email: $('eMail').value, phone: $('ePhone').value, company: $('eCo').value, service: sname, message: $('eMsg').value };
    function post(url, extra) {
      var body = {}, k;
      for (k in data) body[k] = data[k];
      for (k in extra) body[k] = extra[k];
      return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(body) })
        .then(function (r) { return r.json(); })
        .then(function (d) { if (!(d.success === true || d.success === 'true')) { throw new Error(d.message || 'Not sent'); } return d; });
    }

    /* 1st try: Web3Forms (needs the full access key). 2nd try: FormSubmit (no key, one-time email activation). */
    post('https://api.web3forms.com/submit', { access_key: WEB3FORMS_KEY, subject: subject, from_name: 'RakeLink website' })
    .catch(function (err) {
      console.warn('RakeLink: Web3Forms did not accept this, trying FormSubmit.', err);
      return post('https://formsubmit.co/ajax/' + OWNER_MAIL, { _subject: subject, _template: 'table', _captcha: 'false' });
    }).then(function () {
      out.textContent = 'Thank you, ' + $('eName').value.trim() + '. Your enquiry has reached our booking desk. We reply within one working day.';
      form.reset();
      out.appendChild(el('p', 'Need a quicker answer? Message us on WhatsApp:', 'small'));
      enqLinks(out, 'Hello RakeLink, I just sent an enquiry on your website about ' + sname + '.', subject);
    }).catch(function (err) {
      console.warn('RakeLink enquiry not sent:', err);
      out.textContent = 'We could not send this online just now. Please send it with one of these buttons:';
      enqLinks(out, text, subject);
    }).then(function () { btn.disabled = false; });
  });

  /* ---------- bill generator ---------- */
  var items = [];
  function getSeq() { try { return parseInt(localStorage.getItem('rakelink-bill-seq'), 10) || 1001; } catch (e) { return 1001; } }
  function setSeq(n) { try { localStorage.setItem('rakelink-bill-seq', n); } catch (e) {} }
  function today() { var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); }
  function fmtDate(v) { return v ? new Date(v + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''; }

  var ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  var TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  function two(x) { return x < 20 ? ONES[x] : TENS[Math.floor(x / 10)] + (x % 10 ? ' ' + ONES[x % 10] : ''); }
  function three(x) { return (x > 99 ? ONES[Math.floor(x / 100)] + ' Hundred' + (x % 100 ? ' ' : '') : '') + (x % 100 ? two(x % 100) : ''); }
  function words(n) {
    if (n === 0) return 'Zero';
    var out = '', cr = Math.floor(n / 1e7); n %= 1e7;
    var lk = Math.floor(n / 1e5); n %= 1e5;
    var th = Math.floor(n / 1e3); n %= 1e3;
    if (cr) out += words(cr) + ' Crore ';
    if (lk) out += two(lk) + ' Lakh ';
    if (th) out += two(th) + ' Thousand ';
    if (n) out += three(n);
    return out.trim();
  }
  function inWords(p) { var r = Math.floor(p / 100), q = p % 100; return 'Rupees ' + words(r) + (q ? ' and ' + words(q) + ' Paise' : '') + ' Only'; }
  function put(id, val, ph) { var e = $(id), v = (val || '').trim(); e.textContent = v || ph; e.classList.toggle('empty', !v); }

  function renderEditor() {
    var box = $('items');
    box.textContent = '';
    var opts = SERVICES.map(function (s) { return '<option value="' + s.id + '">' + s.name + '</option>'; }).join('');
    items.forEach(function (it, i) {
      var d = el('div', null, 'item');
      d.setAttribute('data-i', i);
      d.innerHTML =
        '<label>Service<select data-k="svc">' + opts + '</select></label>' +
        '<label>Details (commodity, route)<input data-k="desc" type="text"></label>' +
        '<div class="row3"><label>Quantity (<span class="u"></span>)<input data-k="qty" type="number" min="0" step="any"></label>' +
        '<label>Rate in \u20B9<input data-k="rate" type="number" min="0" step="any"></label>' +
        '<button type="button" class="btn rm">Remove</button></div><p class="amt"></p>';
      box.appendChild(d);
      d.querySelector('[data-k=svc]').value = it.svc;
      d.querySelector('[data-k=desc]').value = it.desc;
      d.querySelector('[data-k=qty]').value = it.qty;
      d.querySelector('[data-k=rate]').value = it.rate;
      d.querySelector('.u').textContent = svc(it.svc).unit;
      d.querySelector('.rm').disabled = items.length === 1;
    });
    update();
  }

  function update() {
    var g = parseFloat($('gst').value) || 0, igst = $('tax').value === 'igst';
    put('pNo', $('iNo').value, '-');
    put('pDate', fmtDate($('iDate').value), '-');
    put('pName', $('cName').value, 'Customer name');
    put('pCo', $('cCo').value, 'Company');
    put('pAddr', $('cAddr').value, 'Billing address');
    put('pGstin', $('cGst').value.trim() ? 'GSTIN ' + $('cGst').value.trim().toUpperCase() : '', 'GSTIN');
    put('pTrk', $('cTrk').value.trim() ? 'Consignment ' + $('cTrk').value.trim() : '', 'Consignment ID');
    put('pRoute', $('cRoute').value.trim() ? 'Route: ' + $('cRoute').value.trim() : '', 'Route');
    $('pSupply').textContent = igst ? 'Interstate supply (IGST)' : 'Supply within Gujarat (CGST and SGST)';
    $('pNotes').textContent = $('notes').value.trim();

    var body = $('pRows'), subP = 0, n = 0;
    body.textContent = '';
    document.querySelectorAll('#items .item').forEach(function (card, i) {
      var it = items[i], p = Math.round((it.qty || 0) * (it.rate || 0) * 100);
      card.querySelector('.amt').textContent = 'Line amount ' + rs(p);
      if (p <= 0) return;
      subP += p; n++;
      var tr = el('tr'), s = svc(it.svc), c2 = el('td');
      c2.appendChild(el('b', s.name));
      if (it.desc.trim()) c2.appendChild(el('div', it.desc.trim(), 'small'));
      tr.appendChild(el('td', n)); tr.appendChild(c2);
      tr.appendChild(el('td', it.qty + ' ' + s.unit, 'num'));
      tr.appendChild(el('td', rs(Math.round(it.rate * 100)), 'num'));
      tr.appendChild(el('td', rs(p), 'num'));
      body.appendChild(tr);
    });
    if (!n) {
      var e = el('tr'), td = el('td', 'Add an item with a quantity and rate.', 'empty');
      td.colSpan = 5; e.appendChild(td); body.appendChild(e);
    }
    var gstP = Math.round(subP * g / 100), half = Math.floor(gstP / 2);
    $('tSub').textContent = rs(subP);
    $('rC').style.display = $('rS').style.display = igst ? 'none' : 'flex';
    $('rI').style.display = igst ? 'flex' : 'none';
    $('lC').textContent = 'CGST @ ' + (g / 2) + '%'; $('tC').textContent = rs(half);
    $('lS').textContent = 'SGST @ ' + (g / 2) + '%'; $('tS').textContent = rs(gstP - half);
    $('lI').textContent = 'IGST @ ' + g + '%'; $('tI').textContent = rs(gstP);
    $('tGrand').textContent = rs(subP + gstP);
    $('pWords').textContent = subP ? inWords(subP + gstP) : '';
  }

  function resetForm() {
    ['cName', 'cCo', 'cGst', 'cAddr', 'cTrk', 'cRoute'].forEach(function (id) { $(id).value = ''; });
    $('iNo').value = 'RL-' + getSeq();
    $('iDate').value = today();
    items = [{ svc: 'fwl', desc: '', qty: 1, rate: 35000 }];
    $('bmsg').textContent = '';
    renderEditor();
  }

  $('items').addEventListener('input', function (ev) {
    var card = ev.target.closest('.item'), k = ev.target.getAttribute('data-k');
    if (!card || !k) return;
    var it = items[+card.getAttribute('data-i')];
    if (k === 'svc') {
      var s = svc(ev.target.value);
      it.svc = s.id; it.rate = s.rate;
      card.querySelector('[data-k=rate]').value = s.rate;
      card.querySelector('.u').textContent = s.unit;
    } else if (k === 'desc') { it.desc = ev.target.value; }
    else { it[k] = parseFloat(ev.target.value) || 0; }
    update();
  });
  $('items').addEventListener('click', function (ev) {
    if (!ev.target.classList.contains('rm')) return;
    items.splice(+ev.target.closest('.item').getAttribute('data-i'), 1);
    renderEditor();
  });
  $('addItem').addEventListener('click', function () {
    items.push({ svc: 'fwl', desc: '', qty: 1, rate: 35000 });
    renderEditor();
    var cards = document.querySelectorAll('#items .item');
    cards[cards.length - 1].querySelector('select').focus();
  });
  ['iNo', 'iDate', 'cName', 'cCo', 'cGst', 'cAddr', 'cTrk', 'cRoute', 'gst', 'tax', 'notes'].forEach(function (id) { $(id).addEventListener('input', update); });
  $('print').addEventListener('click', function () {
    if (!$('cName').value.trim()) { $('bmsg').textContent = 'Enter the customer name before printing.'; $('cName').focus(); return; }
    if (!document.querySelector('#pRows .num')) { $('bmsg').textContent = 'Add at least one item with a quantity and rate.'; return; }
    $('bmsg').textContent = '';
    window.print();
  });
  $('reset').addEventListener('click', function () { setSeq(getSeq() + 1); resetForm(); });
  resetForm();
})();

/* If the original image files are uploaded to the repo, use them. Otherwise the drawings stay. */
(function () {
  document.querySelectorAll('[data-img]').forEach(function (box) {
    var list = box.getAttribute('data-img').split(' '), im = new Image();
    im.onload = function () {
      im.alt = box.getAttribute('aria-hidden') === 'true' ? '' : (box.getAttribute('aria-label') || '');
      im.className = box.getAttribute('class') || '';
      if (im.className === 'logo') im.style.width = 'auto';
      if (box.parentNode) box.parentNode.replaceChild(im, box);
    };
    im.onerror = function () { if (list.length > 1) { list.shift(); im.src = list[0]; } };
    im.src = list[0];
  });
})();
