# ♿ Best Practice Accessibilità HTML5 - WCAG 2.1

## Introduzione
L'accessibilità web significa rendere i siti disponibili a tutti, incluse le persone con disabilità. Segui questa guida per assicurare che i progetti Connect & Create siano inclusivi.

---

## 1. 🏷️ FORM ACCESSIBILITY

### ✅ Label Associati (Essenziale)
```html
<!-- ❌ SBAGLIATO -->
<input type="text" placeholder="Nome">

<!-- ✅ CORRETTO -->
<label for="name">Nome *</label>
<input type="text" id="name" name="name" required>
```

### ✅ Indicatori Obbligatori
```html
<!-- Marcare campi obbligatori -->
<label for="email">Email <span aria-label="required">*</span></label>
<input type="email" id="email" name="email" required>
```

### ✅ Messages di Errore Associati
```html
<label for="phone">Telefono</label>
<input type="tel" id="phone" name="phone" aria-describedby="phone-error">
<div id="phone-error" role="alert" class="form-error">
    Numero di telefono non valido
</div>
```

### ✅ Placeholder vs Label
```html
<!-- ❌ SBAGLIATO - Solo placeholder -->
<input type="text" placeholder="Nome">

<!-- ✅ CORRETTO - Label + Placeholder -->
<label for="name">Nome</label>
<input type="text" id="name" name="name" placeholder="Es. Mario Rossi">
```

### ✅ Fieldset per Gruppi
```html
<!-- Per radiobutton e checkbox groups -->
<fieldset>
    <legend>Seleziona il tuo servizio preferito</legend>
    
    <div>
        <input type="radio" id="service-web" name="service" value="web">
        <label for="service-web">Web Design</label>
    </div>
    
    <div>
        <input type="radio" id="service-seo" name="service" value="seo">
        <label for="service-seo">SEO Locale</label>
    </div>
</fieldset>
```

---

## 2. 🖼️ IMAGE ACCESSIBILITY

### ✅ Alt Text Descrittivo
```html
<!-- ❌ SBAGLIATO -->
<img src="hero.jpg" alt="immagine">

<!-- ✅ CORRETTO - Descrittivo -->
<img src="hero.jpg" alt="Team di Connect & Create al lavoro a Lugano">
```

### ✅ Decorative Images
```html
<!-- Per immagini puramente decorative -->
<img src="decoration.svg" alt="" aria-hidden="true">
```

### ✅ Chart/Diagram
```html
<img src="chart.svg" alt="Grafico crescita vendite: 2023: 100k, 2024: 250k, 2025: 500k">
```

### ✅ SVG Accessibility
```html
<svg role="img" aria-label="Logo Connect & Create">
    <title>Connect & Create Logo</title>
    <desc>Logo di un'agenzia web con lettere C e &</desc>
    <!-- SVG content -->
</svg>
```

---

## 3. 📝 SEMANTIC HTML

### ✅ Struttura Corretta
```html
<!-- ✅ CORRETTO - Semantico -->
<header>
    <nav>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">Chi Siamo</a></li>
        </ul>
    </nav>
</header>

<main>
    <article>
        <h1>Titolo Articolo</h1>
        <p>Contenuto...</p>
    </article>
    
    <aside>
        <h2>Sidebar</h2>
        <p>Contenuto aggiuntivo...</p>
    </aside>
</main>

<footer>
    <p>&copy; 2024</p>
</footer>
```

### ✅ Heading Hierarchy
```html
<!-- ✅ CORRETTO - Ordine logico -->
<h1>Titolo Principale (1 solo per pagina)</h1>
<h2>Sottosezione</h2>
<h3>Sub-sottosezione</h3>

<!-- ❌ SBAGLIATO - Salti di livello -->
<h1>Titolo</h1>
<h3>Saltato H2!</h3>
```

---

## 4. 🎨 COLORE E CONTRASTO

### ✅ Contrasto Minimo (WCAG AA)
- **Testo normale**: 4.5:1
- **Testo grande (18pt+)**: 3:1
- **Componenti UI**: 3:1

### ✅ Non Solo Colore
```html
<!-- ❌ SBAGLIATO -->
<p style="color: red;">Campo obbligatorio</p>

<!-- ✅ CORRETTO - Colore + icona + testo -->
<p>
    <span style="color: red;" aria-label="required">*</span>
    Campo obbligatorio
</p>
```

### ✅ Color Blindness
```css
/* Considera le 8 tipi di daltonismo */
--color-primary: #e3000f;   /* Rosso - OK per deuteranopia */
--color-secondary: #050505; /* Nero - universale */
--color-success: #22c55e;   /* Verde - evitare come unico indicatore */
--color-error: #ef4444;     /* Rosso - OK */
```

---

## 5. ⌨️ KEYBOARD NAVIGATION

### ✅ Tab Order Logico
```html
<!-- ✅ CORRETTO - Order naturale -->
<input type="text" id="name" tabindex="1">
<input type="email" id="email" tabindex="2">
<button type="submit" tabindex="3">Invia</button>

<!-- ❌ SBAGLIATO - Tab order confuso -->
<input type="text" tabindex="10">
<input type="email" tabindex="2">
<button type="submit" tabindex="1">
```

### ✅ Focus Visible
```css
/* ✅ CORRETTO - Focus ring visibile */
:focus-visible {
    outline: 3px solid #e3000f;
    outline-offset: 2px;
}

/* ❌ SBAGLIATO - Niente focus ring */
input:focus {
    outline: none;
    border: 1px solid #999;
}
```

### ✅ Skip Links
```html
<!-- Aiuta navigazione da tastiera -->
<header>
    <a href="#main-content" class="skip-link">Vai al contenuto principale</a>
    <nav><!-- nav menu --></nav>
</header>

<main id="main-content">
    <!-- Contenuto principale -->
</main>

<style>
.skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: #e3000f;
    color: white;
    padding: 8px;
    text-decoration: none;
}

.skip-link:focus {
    top: 0;
}
</style>
```

---

## 6. 🔊 ARIA LABELS & ROLES

### ✅ Aria-label per Icone
```html
<!-- ✅ CORRETTO - Icone con label -->
<button aria-label="Chiudi finestra">
    <svg><!-- X icon --></svg>
</button>

<!-- ✅ CORRETTO - Alternative -->
<a href="/" aria-label="Home">
    <svg><!-- Logo --></svg>
</a>
```

### ✅ Aria-describedby
```html
<input 
    type="password" 
    id="pwd"
    aria-describedby="pwd-hint"
>
<small id="pwd-hint">
    Minimo 8 caratteri, includi numeri e simboli
</small>
```

### ✅ Aria-live per Aggiornamenti
```html
<!-- Per notifiche dinamiche -->
<div aria-live="polite" aria-atomic="true">
    <!-- Toast/notifications vanno qui -->
</div>

<!-- Per errori critici -->
<div aria-live="assertive" role="alert">
    <!-- Errori critici vanno qui -->
</div>
```

### ✅ Aria-expanded
```html
<!-- Per menu collassabili -->
<button 
    aria-expanded="false" 
    aria-controls="menu-list"
>
    Menu
</button>

<ul id="menu-list" hidden>
    <li><a href="#">Opzione 1</a></li>
</ul>

<script>
    button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !expanded);
        menuList.hidden = expanded;
    });
</script>
```

---

## 7. 📱 MOBILE ACCESSIBILITY

### ✅ Touch Targets
```html
<!-- Minimo 44x44 px per touch target -->
<button style="min-height: 44px; min-width: 44px;">
    Clicca
</button>
```

### ✅ Viewport Meta
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### ✅ Text Resizing
```css
/* ✅ CORRETTO - Supporta zoom fino a 200% -->
body {
    font-size: 16px;
    line-height: 1.5;
}

/* ❌ SBAGLIATO - Disabilita zoom -->
<meta name="viewport" content="user-scalable=no">
```

---

## 8. 🎬 VIDEO & ANIMATION

### ✅ Video Captions
```html
<video controls>
    <source src="video.mp4" type="video/mp4">
    <track kind="captions" src="captions.vtt" srclang="it">
</video>
```

### ✅ Reduced Motion
```css
/* Rispetta preferenze di movimento ridotto -->
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

### ✅ Autoplay Prevention
```html
<!-- ❌ SBAGLIATO -->
<video autoplay>

<!-- ✅ CORRETTO - Richiedi esplicito click -->
<video controls>
    <source src="video.mp4" type="video/mp4">
</video>
```

---

## 9. 📄 DOCUMENT STRUCTURE

### ✅ Language Attribute
```html
<!-- ✅ CORRETTO -->
<html lang="it">

<!-- Per parti in altre lingue -->
<p>Questo è in italiano, eccetto <span lang="en">this English phrase</span>.</p>
```

### ✅ Page Title
```html
<!-- ✅ CORRETTO - Unico e descrittivo -->
<title>Contatti - Studio Legale Ticino - Lugano</title>

<!-- ❌ SBAGLIATO -->
<title>Home</title>
```

### ✅ Language Change Notification
```html
<p>
    Leggi il nostro 
    <a href="/en/about" lang="en" hreflang="en">English version</a>
</p>
```

---

## 10. 🧪 TESTING CHECKLIST

### ✅ Keyboard Only Navigation
- [ ] Tutti gli elementi interattivi raggiungibili con Tab
- [ ] Order logico del Tab
- [ ] Nessun focus intrappolato
- [ ] Visible focus indicator

### ✅ Screen Reader Testing
- [ ] Testare con NVDA (Windows) o VoiceOver (Mac)
- [ ] Forms ben etichettate
- [ ] Alt text significativi
- [ ] Semantic HTML

### ✅ Color & Contrast
- [ ] Contrast ratio ≥ 4.5:1 per testo
- [ ] Non usare colore come unico indicatore
- [ ] Testare con Coblis (color blindness simulator)

### ✅ Zoom & Magnification
- [ ] Testare con zoom 200%
- [ ] Content non si tagli
- [ ] Nessuno layout rotto

### ✅ Mobile Accessibility
- [ ] Touch targets ≥ 44x44px
- [ ] Zoom ≤ 200%
- [ ] Nessun horizontal scroll

### ✅ Automate Testing
```bash
# Usa strumenti come Axe DevTools
# Chrome: axe DevTools extension
# Firefox: WAVE extension
# CLI: npm install -g @axe-core/cli
```

---

## 📚 Tools Consigliati

| Tool | Uso | Link |
|------|-----|------|
| **Axe DevTools** | A11y testing | chrome.google.com/webstore |
| **WAVE** | Visual feedback | wave.webaim.org |
| **Lighthouse** | Audit completo | Built in Chrome DevTools |
| **NVDA** | Screen reader | nvaccess.org |
| **VoiceOver** | Screen reader Mac | support.apple.com |
| **Coblis** | Color blindness | color-blindness.com |
| **WebAIM** | Resources | webaim.org |

---

## 🎯 WCAG 2.1 Conformance Levels

### 🟩 Level A (Minimo)
- Basic accessibility features
- Dovresti raggiungere questo

### 🟨 Level AA (Recommended)
- Enhanced accessibility
- Target per maggior siti web pubblici
- **Connect & Create target**

### 🟥 Level AAA (Enhanced)
- Extra accessibility features
- Per siti specifici come governo

---

## 📞 Risorse Utili

- **Web Content Accessibility Guidelines (WCAG)** - w3.org/WAI/WCAG21/quickref/
- **MDN Accessibility** - developer.mozilla.org/en-US/docs/Web/Accessibility
- **Inclusive Components** - inclusive-components.design
- **A11y Project** - a11yproject.com

---

**Ricorda**: L'accessibilità non è una feature, è un diritto! 🌍✨
