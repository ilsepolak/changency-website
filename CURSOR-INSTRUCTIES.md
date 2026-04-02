# De Changency — Website Instructies voor Cursor

## Over dit project

De Changency is een consultancy gericht op twee trajecten:
1. **Adoptie & implementatie** — Zorgen dat nieuwe software en systemen echt worden gebruikt
2. **Digitale vaardigheden** — Inzicht in en ontwikkeling van het digitale niveau van medewerkers

Beide trajecten volgen dezelfde methode: **meet waar mensen staan, bouw van daaruit een aanpak.**

Het platform **SAAR Insights** (saar-insights.nl) is het instrument achter de aanpak. SAAR wordt expliciet benoemd als eigen product, met doorlink.

**Doelgroep**: Primair woningcorporaties, ook open voor andere maatschappelijke organisaties.
**Toon**: "We/onze" op site (deur open voor groei), "ik" op Over-pagina. Professioneel, concreet, geen jargon.
**Ambitie**: Op termijn consultants onder De Changency-vlag. Subtiel benoemd, niet gepusht.

---

## Sitestructuur

4 items in de navigatie, 6 HTML-bestanden:

```
Navigatie:        Home | Diensten | Over | Contact

Bestanden:
index.html                              → Home
diensten.html                           → Diensten (overzicht, twee routes)
diensten/adoptie.html                   → Adoptie & implementatie (detail)
diensten/digitale-vaardigheden.html     → Digitale vaardigheden (detail)
over.html                               → Over Ilse
contact.html                            → Contact
```

De twee detailpagina's zijn subpagina's van Diensten. In de navigatie valt "Diensten" actief bij alle drie.

---

## Visuele richtlijnen

### Fonts
- **Headings**: Plus Jakarta Sans (600, 700)
- **Body**: Inter (400, 500, 600)
- Via Google Fonts

### Kleurenpalet
| Rol | Hex | Gebruik |
|-----|-----|---------|
| Primair | `#8B3A62` | Knoppen, accenten, links, labels |
| Primair light | `#A85080` | Hover states |
| Accent | `#D4A0B0` | Highlights, nummering, border-left |
| Accent light | `#E8C8D2` | Badges |
| Donker | `#3D1F2E` | Headings, footer achtergrond |
| Tekst | `#2D2D2D` | Bodytekst |
| Tekst licht | `#6B6B6B` | Subtekst |
| Achtergrond | `#FAFAF8` | Hoofdachtergrond |
| Achtergrond alt | `#F3F0EE` | Afwisselende secties |
| Border | `#E5E0DC` | Scheidingslijnen |

### Ontwerp
- Clean, modern, veel whitespace
- Persoonlijk en warm (Ilse centraal op Over/Contact)
- Verwant aan SAAR Insights (zelfde fonts, warmer palet)
- Afwisselende secties wit / lichtgrijs
- Subtiele schaduwen, afgeronde hoeken (8px)
- Sticky header met backdrop-blur
- Fade-in bij scrollen (IntersectionObserver)
- Mobile-first, breakpoints 768px en 968px
- Footer donker (#3D1F2E)

---

## Benodigde afbeeldingen

| Bestand | Beschrijving | Status |
|---------|-------------|--------|
| `images/logo.png` | Changency logo | Beschikbaar (logo-logotype.png) |
| `images/logo-white.png` | Logo wit voor footer | Moet gemaakt worden |
| `images/ilse-hero.jpg` | Brede portretfoto homepage | Moet aangeleverd worden |
| `images/ilse-over.jpg` | Grote foto Over-pagina | Moet aangeleverd worden |
| `images/ilse-avatar.png` | Ronde avatar contactpagina | Beschikbaar |

---

## Technische opzet

- Plain HTML5, CSS3, vanilla JavaScript
- Geen frameworks of build tools

### Bestandsstructuur
```
de-changency/
├── index.html
├── diensten.html
├── over.html
├── contact.html
├── diensten/
│   ├── adoptie.html
│   └── digitale-vaardigheden.html
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── components.css
│   └── pages.css
├── js/
│   └── main.js
├── images/
└── favicon.ico
```

### Interacties
- Sticky header met schaduw bij scroll
- Mobile hamburger menu
- Scroll fade-in animaties
- Hover effects op knoppen en kaarten

---

## Booking link (alle CTA's)

```
https://outlook.office.com/bookwithme/user/3ba84f5275a04a53a552e55d74b078a3@de-changency.nl/meetingtype/CZYwrjTpFEqelQYrEpkcug2?anonymous&ep=mcard
```

---

## Bouwvolgorde

1. CSS tokens (variables.css) en base styles (base.css)
2. Componenten: header, footer, knoppen, kaarten (components.css)
3. Homepage bouwen en responsief maken
4. Diensten-overzichtspagina
5. Adoptie-detailpagina
6. Digitale vaardigheden-detailpagina
7. Over-pagina
8. Contact-pagina
9. Pagina-specifieke styles (pages.css)
10. JavaScript: sticky header, mobile menu, scroll animations
11. Testen op alle breakpoints en apparaten
