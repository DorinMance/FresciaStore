# frescia-theme

Temă Shopify 2.0 custom pentru [fresciastore.ro](https://fresciastore.ro) — magazin de produse italiene autentice.

---

## Structura temei

```
frescia-theme/
├── assets/
│   ├── frescia-theme.css     ← Tot CSS-ul (variabile, responsive, animații)
│   └── frescia-theme.js      ← JS: AJAX cart, accordion, video, toast
├── config/
│   ├── settings_schema.json  ← Schema setărilor globale (culori, topbar, social)
│   └── settings_data.json    ← Valori salvate ale setărilor (NU se commitează)
├── layout/
│   └── theme.liquid          ← HTML shell: topbar, navbar, footer, CSS/JS
├── locales/
│   ├── ro.default.json       ← Traduceri română (principal)
│   └── en.default.json       ← Traduceri engleză
├── sections/
│   ├── hero-video.liquid     ← Secțiunea hero cu video fullscreen
│   └── trust-bar.liquid      ← Bara cu 4 beneficii (editabilă din Customizer)
├── snippets/
│   ├── sidebar.liquid        ← Sidebar cu categorii dinamice + accordion
│   └── footer.liquid         ← Footer 4 coloane + social + plăți
└── templates/
    ├── index.liquid           ← Homepage
    ├── collection.liquid      ← Pagina colecție cu sort + paginare
    └── page.contact.liquid    ← Pagina contact cu hartă + formular
```

---

## Cum se editează din Shopify Customizer

1. **Shopify Admin → Online Store → Themes → Customize**
2. Fiecare secțiune apare în panoul din stânga

### Hero Video
- Click pe secțiunea **"Hero Video"**
- Modifici: URL video, titlu, subtitlu, text badge, butoane, opacitate overlay
- Adaugă un video MP4 în **Settings → Files** și copiază URL-ul

### Trust Bar (bara de beneficii)
- Click pe **"Trust Bar"** → poți edita fiecare dintre cele 4 blocuri
- Schimbi iconița, titlul și descrierea fiecărui beneficiu
- Poți adăuga/șterge blocuri (maxim 4)

### Topbar (banda verde de sus)
- **Online Store → Themes → Customize → Theme settings → Topbar**
- Modifici textul, suma, culorile sau dezactivezi topbar-ul complet

### Footer
- Secțiunile de meniu din footer se configurează în **Navigation**:
  - Creează un meniu cu handle `footer-magazin`
  - Creează un meniu cu handle `footer-ajutor`
- Social media: **Theme settings → Social Media**

### Navbar
- Meniul principal: **Navigation → main-menu**
- Logo text + domeniu: **Theme settings → Navigație**

---

## Cum se adaugă categorii noi

> **Nu e nevoie să atingi codul.** Sidebar-ul și footer-ul citesc colecțiile dinamic.

1. **Shopify Admin → Products → Collections → Create collection**
2. Adaugă produse în colecție (manual sau prin conditions)
3. Adaugă o imagine reprezentativă colecției (apare în sidebar și pe homepage)
4. Salveaz — colecția apare automat în sidebar, footer și grid-ul de categorii

---

## Cum se face deploy (upload în Shopify)

### Metodă 1: Upload ZIP (cel mai simplu pentru start)
1. Selectează toate fișierele temei → creează un ZIP
2. **Shopify Admin → Online Store → Themes → Add theme → Upload zip file**
3. Tema apare ca "Unpublished" → Preview sau Publish

### Metodă 2: GitHub (după aprobare design)
1. `git init && git add . && git commit -m "Initial commit"`
2. Creează repo pe GitHub și fă push
3. **Shopify Admin → Online Store → Themes → Add theme → Connect from GitHub**
4. Selectezi repo-ul și branch-ul
5. La fiecare `git push`, Shopify auto-deploy

### Metodă 3: Shopify CLI
```bash
npm install -g @shopify/cli @shopify/theme
shopify theme push --store fresciastore.myshopify.com
```

---

## Cum se face tema de iarnă / sezonieră

1. **Shopify Admin → Online Store → Themes → ⋯ → Duplicate**
2. Redenumiți copia "frescia-theme-iarna"
3. Customize → **Theme settings → Culori**:
   - Culoare primară: `#1a3a5c` (albastru nocturn) sau `#2c1a4a` (mov)
   - Culoare accent: `#e8d5b7` (auriu crem) sau `#c0392b` (roșu Crăciun)
4. În Hero Video: înlocuiești videoul / imaginea cu una sezonieră
5. Publici tema sezonieră când vine perioada

---

## Setări CSS globale

Variabilele CSS pot fi suprascrise direct în `assets/frescia-theme.css` → secțiunea `:root`:

```css
:root {
  --color-primary:  #1a4a2e;  /* verde închis */
  --color-accent:   #c9a84c;  /* auriu */
  --font-heading:   'Playfair Display', serif;
  --font-body:      'DM Sans', sans-serif;
}
```

---

## AJAX Cart

Butonul "Adaugă în coș" de pe orice produs trimite o cerere `/cart/add.js` fără reload de pagină.
Badge-ul din navbar se actualizează automat. Un toast verde confirmă adăugarea.

---

## Compatibilitate

- Shopify Online Store **2.0**
- Responsive: desktop (1280px+), tabletă (768px), mobil (480px)
- Browsere: Chrome, Firefox, Safari, Edge (ultimele 2 versiuni majore)
