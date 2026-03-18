const header = document.querySelector('.site-header');
const hero = document.querySelector('.hero');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

function onScroll() {
  const y = window.scrollY;
  header?.classList.toggle('scrolled', y > 40);
  const heroH = hero?.offsetHeight ?? 0;
  header?.classList.toggle('nav-over-light', y > heroH * 0.72);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

document.querySelectorAll('.reveal').forEach((el) => {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          obs.unobserve(e.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );
  obs.observe(el);
});

navToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', open);
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

// Business list — supports large Google-categorized datasets (search + filter + mapsUrl + tags)
const CATEGORY_ORDER = [
  'Emergency helplines',
  'District administration',
  'Revenue',
  'Municipal',
  'Police',
  'Healthcare',
  'Postal',
  'Citizen services',
  'Government',
  'Road transport',
  'Railway',
  'Hotel & restaurant',
  'Restaurant',
  'Hotel & lodging',
  'Supermarket',
  'Shopping mall',
  'Shopping street',
  'Cafe & bakery',
  'Electronics',
  'Fashion',
  'Jewellery',
  'Pharmacy',
  'Bank',
  'Retail',
  'Wholesale & retail',
  'Home & hardware',
  'Automobile',
  'Services',
  'Education',
  'Transport',
  'Agriculture',
];

function sortKeyCategory(cat) {
  const i = CATEGORY_ORDER.indexOf(cat);
  return i === -1 ? 1000 + String(cat || '').charCodeAt(0) : i;
}

function matchesBizSearch(b, q) {
  if (!q || !q.trim()) return true;
  const hay = [
    b.name,
    b.nameTe,
    b.description,
    b.category,
    Array.isArray(b.tags) ? b.tags.join(' ') : '',
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  const words = q
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  return words.every((w) => hay.includes(w));
}

function renderBizCard(b) {
  const tags =
    Array.isArray(b.tags) && b.tags.length
      ? `<div class="biz-tags">${b.tags.map((t) => `<span class="biz-tag">${escapeHtml(t)}</span>`).join('')}</div>`
      : '';
  const maps =
    b.mapsUrl && String(b.mapsUrl).trim()
      ? `<a href="${escapeAttr(b.mapsUrl.trim())}" target="_blank" rel="noopener" class="biz-link biz-link--maps">Google Maps</a>`
      : '';
  const site =
    b.link && b.linkLabel
      ? `<a href="${escapeAttr(b.link)}" target="_blank" rel="noopener" class="biz-link">${escapeHtml(b.linkLabel)}</a>`
      : '';
  const links = [maps, site].filter(Boolean).join(' ');
  return `
    <article class="biz-card biz-card--entry" data-category="${escapeAttr(b.category)}">
      <h3>${escapeHtml(b.name)}</h3>
      ${b.nameTe ? `<p class="biz-name-te">${escapeHtml(b.nameTe)}</p>` : ''}
      ${tags}
      <p class="biz-desc">${escapeHtml(b.description || '')}</p>
      ${b.phone ? `<p class="biz-phone"><a href="tel:${escapeAttr(String(b.phone).replace(/\s/g, ''))}">${escapeHtml(b.phone)}</a></p>` : ''}
      ${links ? `<p class="biz-links-row">${links}</p>` : ''}
    </article>`;
}

function renderBusinessList(items, businessListEl, countEl) {
  const sorted = [...items].sort((a, b) => {
    const ca = sortKeyCategory(a.category);
    const cb = sortKeyCategory(b.category);
    if (ca !== cb) return ca - cb;
    return (a.name || '').localeCompare(b.name || '');
  });
  let lastCat = '';
  const parts = [];
  sorted.forEach((b) => {
    if (b.category !== lastCat) {
      lastCat = b.category;
      parts.push(`<h4 class="biz-group-title">${escapeHtml(b.category)}</h4>`);
    }
    parts.push(renderBizCard(b));
  });
  businessListEl.innerHTML = parts.join('') || '<p class="biz-load-err">No matches.</p>';
  if (countEl) {
    countEl.textContent = items.length ? `${items.length} place${items.length === 1 ? '' : 's'}` : 'No matches';
  }
}

const businessList = document.getElementById('business-list');
const bizToolbar = document.getElementById('biz-toolbar');
const bizSearch = document.getElementById('biz-search');
const bizFilterCat = document.getElementById('biz-filter-cat');
const bizCount = document.getElementById('biz-count');

if (businessList) {
  const base = import.meta.env.BASE_URL || '/';
  const bizDataUrl = (base.endsWith('/') ? base : `${base}/`) + 'data/businesses.json';
  fetch(bizDataUrl)
    .then((r) => {
      if (!r.ok) throw new Error('fetch');
      return r.json();
    })
    .then((items) => {
      businessList.setAttribute('aria-busy', 'false');
      if (!Array.isArray(items)) throw new Error('bad json');

      const categories = [...new Set(items.map((x) => x.category).filter(Boolean))].sort((a, b) => {
        const ia = CATEGORY_ORDER.indexOf(a);
        const ib = CATEGORY_ORDER.indexOf(b);
        if (ia === -1 && ib === -1) return a.localeCompare(b);
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
      });

      if (bizFilterCat) {
        categories.forEach((c) => {
          const opt = document.createElement('option');
          opt.value = c;
          opt.textContent = c;
          bizFilterCat.appendChild(opt);
        });
      }
      if (bizToolbar) bizToolbar.hidden = false;

      const allItems = items;

      function applyFilters() {
        const q = bizSearch?.value || '';
        const cat = bizFilterCat?.value || '';
        let filtered = allItems;
        if (cat) filtered = filtered.filter((b) => b.category === cat);
        filtered = filtered.filter((b) => matchesBizSearch(b, q));
        renderBusinessList(filtered, businessList, bizCount);
      }

      renderBusinessList(allItems, businessList, bizCount);
      bizSearch?.addEventListener('input', applyFilters);
      bizFilterCat?.addEventListener('change', applyFilters);
    })
    .catch(() => {
      businessList.setAttribute('aria-busy', 'false');
      businessList.innerHTML = '<p class="biz-load-err">Directory unavailable. Try again later.</p>';
    });
}

const repList = document.getElementById('representatives-list');
const repDisclaimer = document.getElementById('rep-disclaimer');
if (repList) {
  const repBase = import.meta.env.BASE_URL || '/';
  const repDataUrl = (repBase.endsWith('/') ? repBase : `${repBase}/`) + 'data/representatives.json';
  fetch(repDataUrl)
    .then((r) => r.json())
    .then((data) => {
      repList.setAttribute('aria-busy', 'false');
      if (repDisclaimer && data.disclaimer) {
        repDisclaimer.textContent = data.disclaimer;
      }
      const blocks = [data.mla, data.mp, data.municipal_chairman].filter(Boolean);
      repList.innerHTML = blocks
        .map((row) => {
          const name =
            row.name && String(row.name).trim()
              ? escapeHtml(row.name)
              : '<span class="rep-name-placeholder">—</span>';
          const party =
            row.party && String(row.party).trim()
              ? `<p class="rep-party">${escapeHtml(row.party)}</p>`
              : '';
          const wiki =
            row.wikipedia && row.name
              ? `<a href="${escapeAttr(row.wikipedia)}" target="_blank" rel="noopener" class="biz-link">Profile / info</a>`
              : '';
          return `
          <article class="rep-card">
            <p class="rep-label-en">${escapeHtml(row.label_en)}</p>
            ${row.label_te ? `<p class="rep-label-te">${escapeHtml(row.label_te)}</p>` : ''}
            <h4 class="rep-name">${name}</h4>
            ${party}
            <p class="rep-detail">${escapeHtml(row.detail || '')}</p>
            ${wiki}
          </article>`;
        })
        .join('');
    })
    .catch(() => {
      repList.setAttribute('aria-busy', 'false');
      repList.innerHTML = '<p class="biz-load-err">Could not load representatives.</p>';
    });
}

const baseUrl = import.meta.env.BASE_URL || '/';
const dataPrefix = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

const wardChipsWrap = document.getElementById('ward-chips-wrap');
const wardsBlock = document.getElementById('wards-block');
const wardsDisclaimerEl = document.getElementById('wards-disclaimer');
if (wardChipsWrap && wardsBlock) {
  fetch(`${dataPrefix}data/wards.json`)
    .then((r) => r.json())
    .then((data) => {
      wardsBlock.setAttribute('aria-busy', 'false');
      if (wardsDisclaimerEl) wardsDisclaimerEl.textContent = data.disclaimer || '';
      const nums = (data.wards || []).map((w) => (typeof w === 'number' ? w : w.no)).filter((n) => n != null);
      wardChipsWrap.innerHTML = nums.map((n) => `<span class="ward-chip">${escapeHtml(String(n))}</span>`).join('');
    })
    .catch(() => {
      wardsBlock.setAttribute('aria-busy', 'false');
      if (wardsDisclaimerEl) wardsDisclaimerEl.textContent = 'Ward list could not be loaded.';
      wardChipsWrap.innerHTML = '';
    });
}

const nearbyInTown = document.getElementById('nearby-in-town');
const nearbyOut = document.getElementById('nearby-out');
const nearbyDisclaimerEl = document.getElementById('nearby-disclaimer');
const nearbyBlock = document.getElementById('nearby-block');
if (nearbyInTown && nearbyOut && nearbyBlock) {
  fetch(`${dataPrefix}data/nearby-places.json`)
    .then((r) => r.json())
    .then((data) => {
      nearbyBlock.setAttribute('aria-busy', 'false');
      if (nearbyDisclaimerEl) nearbyDisclaimerEl.textContent = data.disclaimer || '';
      function card(p, showKm) {
        const km =
          showKm && p.approxKm
            ? `<span class="nearby-km">~${escapeHtml(p.approxKm)} km</span>`
            : `<span class="nearby-km nearby-km--local">${escapeHtml(p.note || '')}</span>`;
        const link = p.mapsUrl
          ? `<a href="${escapeAttr(p.mapsUrl)}" target="_blank" rel="noopener" class="nearby-maps">Maps</a>`
          : '';
        return `<article class="nearby-card">
          <div class="nearby-card-top">${km}</div>
          <h4 class="nearby-card-title">${escapeHtml(p.name)}</h4>
          ${p.nameTe ? `<p class="nearby-card-te">${escapeHtml(p.nameTe)}</p>` : ''}
          <p class="nearby-card-desc">${escapeHtml(p.description)}</p>
          ${link ? `<p class="nearby-card-link">${link}</p>` : ''}
        </article>`;
      }
      nearbyInTown.innerHTML = (data.inTown || []).map((p) => card(p, false)).join('');
      nearbyOut.innerHTML = (data.nearby || []).map((p) => card(p, true)).join('');
    })
    .catch(() => {
      nearbyBlock.setAttribute('aria-busy', 'false');
      nearbyInTown.innerHTML = '';
      nearbyOut.innerHTML = '<p class="biz-load-err">Could not load places to visit.</p>';
    });
}

function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
