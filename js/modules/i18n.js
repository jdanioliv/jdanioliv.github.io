// LANGUAGE SWITCHER
// English is written directly in the HTML. Every other language has its own file in
// js/translations/ with the same keys, and only the chosen one is downloaded.
// Names (Python, Java, GitHub...) stay the same because those files don't translate them.

// Python: LANGUAGES = {"en": "English", "es": "Español", ...}
const LANGUAGES = {
    en: 'English',
    es: 'Español',
    pt: 'Português',
    it: 'Italiano',
    ca: 'Català',
    de: 'Deutsch',
    fr: 'Français',
};
const LANGUAGE_CODES = Object.keys(LANGUAGES);
const LANGUAGE_STORAGE_KEY = 'portfolio-language';
const TRANSLATED_ATTRIBUTES = ['placeholder', 'aria-label', 'content', 'alt'];

// The site's main folder, taken from this file's own address (course pages are one level down)
const SITE_ROOT = document.currentScript.src.replace(/js\/modules\/i18n\.js.*$/, '');

const translations = {};  // Filled by js/translations/*.js, e.g. translations.es = {...}
const englishText = {};   // The English from the HTML, kept so we can switch back to it
const loadingFiles = {};  // So each language file is only downloaded once
let currentLanguage = 'en';
let requestedLanguage = 'en';


// 1. WHICH LANGUAGE TO START IN
function saveLanguage(language) {
    try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
        // Storage blocked (private mode): the language just isn't remembered
    }
}

function readSavedLanguage() {
    try {
        return localStorage.getItem(LANGUAGE_STORAGE_KEY);
    } catch {
        return null;
    }
}

function chooseStartLanguage() {
    // A link like ?lang=es wins, so a link sent to someone always opens in that language
    const fromLink = new URLSearchParams(location.search).get('lang');
    if (LANGUAGE_CODES.includes(fromLink)) {
        saveLanguage(fromLink);
        return fromLink;
    }

    // Then what the visitor chose last time
    const saved = readSavedLanguage();
    if (LANGUAGE_CODES.includes(saved)) return saved;

    // Then the browser's languages, in order ("es-ES" -> "es")
    for (const browserLanguage of navigator.languages || []) {
        const code = browserLanguage.slice(0, 2).toLowerCase();
        if (LANGUAGE_CODES.includes(code)) return code;
    }

    return 'en';
}


// 2. TEXT
// For text that JavaScript writes (terminal, task manager...). Falls back to the English.
// Python: translations[language].get(key, english).format(**values)
function t(key, english, values = {}) {
    const dictionary = translations[currentLanguage] || {};
    let text = dictionary[key] ?? english;
    for (const [name, value] of Object.entries(values)) {
        text = text.replace(`{${name}}`, () => value);
    }
    return text;
}

// For text in the HTML: <p data-i18n="about.p1"> or <input data-i18n-placeholder="...">
// The translation files are written by hand and are part of this site, so innerHTML is safe here.
function translatePage() {
    const dictionary = translations[currentLanguage] || {};
    document.documentElement.lang = currentLanguage;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.dataset.i18n;
        if (!(key in englishText)) englishText[key] = element.innerHTML;
        element.innerHTML = dictionary[key] ?? englishText[key];
    });

    TRANSLATED_ATTRIBUTES.forEach((attribute) => {
        document.querySelectorAll(`[data-i18n-${attribute}]`).forEach((element) => {
            const key = element.getAttribute(`data-i18n-${attribute}`);
            if (!(key in englishText)) englishText[key] = element.getAttribute(attribute);
            element.setAttribute(attribute, dictionary[key] ?? englishText[key]);
        });
    });
}

// The CV PDFs exist in English and Spanish. Catalan gets the Spanish one, the rest the English one.
function updateCvLinks() {
    const mainFile = ['es', 'ca'].includes(currentLanguage) ? 'ES' : 'EN';
    const otherFile = mainFile === 'ES' ? 'EN' : 'ES';
    const cvPath = (code) => `${SITE_ROOT}assets/cv/CV_Joao_Daniel_de_Paiva_Oliveira_${code}.pdf`;

    document.querySelectorAll('[data-cv-link="main"]').forEach((link) => {
        link.href = cvPath(mainFile);
    });
    document.querySelectorAll('[data-cv-link="other"]').forEach((link) => {
        link.href = cvPath(otherFile);
    });
}


// 3. CHANGING LANGUAGE
function loadTranslations(language) {
    if (language === 'en') return Promise.resolve();

    if (!loadingFiles[language]) {
        loadingFiles[language] = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `${SITE_ROOT}js/translations/${language}.js`;
            script.onload = resolve;
            script.onerror = () => {
                delete loadingFiles[language];  // Allow another try later
                reject(new Error(`Could not download the ${language} translation`));
            };
            document.head.appendChild(script);
        });
    }
    return loadingFiles[language];
}

// While a language is loading the page stays hidden, so English doesn't flash first
function showPage() {
    document.documentElement.classList.remove('i18n-loading');
}

function setLanguage(language) {
    requestedLanguage = language;

    return loadTranslations(language)
        .then(() => {
            if (language !== requestedLanguage) return;  // Another language was picked meanwhile

            currentLanguage = language;
            translatePage();
            updateCvLinks();
            updateLanguageSwitcher();

            // terminal.js and main.js listen to this to rewrite the text they created
            document.dispatchEvent(new CustomEvent('i18n:change'));
        })
        .catch((error) => {
            // The file didn't download: stay in the language we already have
            requestedLanguage = currentLanguage;
            document.documentElement.lang = currentLanguage;
            console.warn(error.message);
        })
        .finally(showPage);
}


// 4. THE BUTTON
function updateLanguageSwitcher() {
    const button = document.querySelector('.lang__button');
    if (!button) return;

    button.querySelector('.lang__code').textContent = currentLanguage.toUpperCase();
    button.setAttribute('aria-label', `${t('language.change', 'Change language')}: ${LANGUAGES[currentLanguage]}`);

    document.querySelectorAll('.lang__option').forEach((option) => {
        const isCurrent = option.dataset.language === currentLanguage;
        option.classList.toggle('lang__option--current', isCurrent);
        option.setAttribute('aria-current', isCurrent);
    });
}

function buildLanguageSwitcher() {
    const holder = document.querySelector('[data-language-switcher]');
    if (!holder) return;

    // Python: "".join(f"<li>...{name}...</li>" for code, name in LANGUAGES.items())
    const options = LANGUAGE_CODES.map((code) => `
        <li><button type="button" class="lang__option" lang="${code}" data-language="${code}">${LANGUAGES[code]}</button></li>
    `).join('');

    holder.innerHTML = `
        <button type="button" class="lang__button" aria-expanded="false" aria-controls="language-menu">
            <svg class="lang__icon" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9"/>
                <path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9s1.3-6.5 3.8-9z"/>
            </svg>
            <span class="lang__code">EN</span>
        </button>
        <ul class="lang__menu" id="language-menu" hidden>${options}</ul>
    `;

    const button = holder.querySelector('.lang__button');
    const menu = holder.querySelector('.lang__menu');

    function setMenuOpen(isOpen) {
        menu.hidden = !isOpen;
        button.setAttribute('aria-expanded', isOpen);
    }

    button.addEventListener('click', () => setMenuOpen(menu.hidden));

    holder.querySelectorAll('.lang__option').forEach((option) => {
        option.addEventListener('click', () => {
            const language = option.dataset.language;
            setMenuOpen(false);
            button.focus();
            saveLanguage(language);

            // Put the language in the address, so copying the link keeps it
            try {
                const url = new URL(location.href);
                url.searchParams.set('lang', language);
                history.replaceState(null, '', url);
            } catch {
                // Some browsers block this on pages opened directly from a file
            }

            setLanguage(language);
        });
    });

    // Close it when clicking outside or pressing Escape
    document.addEventListener('click', (event) => {
        if (!holder.contains(event.target)) setMenuOpen(false);
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !menu.hidden) {
            setMenuOpen(false);
            button.focus();
        }
    });

    updateLanguageSwitcher();
}


// 5. START
const startLanguage = chooseStartLanguage();

if (startLanguage !== 'en') {
    document.documentElement.lang = startLanguage;
    document.documentElement.classList.add('i18n-loading');
    setTimeout(showPage, 3000);  // Never leave the page hidden if the network is very slow
    loadTranslations(startLanguage).catch(() => {});  // Start downloading right away
}

document.addEventListener('DOMContentLoaded', () => {
    buildLanguageSwitcher();
    if (startLanguage !== 'en') setLanguage(startLanguage);
});
