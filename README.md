# Portfolio | Joao Daniel De Paiva Oliveira

Hi! I'm **Joao Daniel De Paiva Oliveira** (*Maru* online), an IT systems (**SMR**) student in Barcelona moving into software development (**DAM**), with the long-term goal of working with **Python, data and AI**.

This repository is the source code of my personal portfolio, built with plain HTML, CSS and JavaScript (no frameworks) and hosted on GitHub Pages.

**Live site:** https://jdanioliv.github.io/

---

## What's inside

* **Home page** (`index.html`): about me, skills, projects, a learning section, contact details and a small interactive terminal.
* **Interactive CV** (`cv.html`): my CV as a web page, with the same terminal and PDF downloads in English and Spanish (`assets/cv/`).
* **Lab**: three mini apps that run in the browser:
  * Text analyzer (JavaScript)
  * Server log analyzer (Python with PyScript, source in `python/log_analyzer.py`)
  * Task manager (JavaScript + `localStorage`)
* **Course pages** (`courses/`): the CS50x certificate and the outlines of the courses I'm taking.
* **Seven languages**: English, Español, Português, Italiano, Català, Deutsch and Français, with a language button on every page.
* Responsive layout with a mobile menu.

## Stack

* **Frontend:** semantic HTML5, CSS3 (Grid, Flexbox, media queries) and JavaScript (ES6+), no frameworks.
* **Python:** PyScript to run Python in the browser.
* **Version control & hosting:** Git, GitHub and GitHub Pages.

## Project structure

```
index.html            Home page
cv.html               Interactive CV
css/index.css         All the styles
js/modules/main.js    Mobile menu, lab tabs and mini apps
js/modules/terminal.js  Interactive terminal (home + CV)
js/modules/i18n.js    Language button and translation engine
js/translations/      One file per language (es, pt, it, ca, de, fr)
python/log_analyzer.py  Log analyzer used by the Python lab app
courses/              One page per course
assets/cv/            CV PDFs (EN / ES) and the HTML they're printed from
assets/img/           CS50x certificate, favicon and link preview image
favicon.ico           Tab icon for browsers that look for it at the site root
```

## Roadmap

- [x] Project setup, Git and documentation
- [x] Responsive home page
- [x] Lab with JavaScript and Python mini apps
- [x] Interactive CV
- [x] Seven languages

## Languages

English is written directly in the HTML and JavaScript. Every other language has a file in `js/translations/`, and only the one the visitor chooses is downloaded. Names like Python, Java or GitHub stay the same because the translation files simply don't translate them. Browser auto-translation is turned off (`translate="no"`), because Chrome turned "Python" into "pitón".

The page chooses its language in this order: a `?lang=es` link, the visitor's last choice, the browser's language, then English. To send someone the site in a specific language, add `?lang=` and the code to the link: `es`, `pt`, `it`, `ca`, `de`, `fr` or `en`.

**To change or add a text:**

1. In the HTML, give the element a key: `<p data-i18n="about.p1">English text</p>`. For attributes, use `data-i18n-placeholder`, `data-i18n-aria-label`, `data-i18n-content` or `data-i18n-alt`.
2. In JavaScript, use `t('some.key', 'English text')`.
3. Add the same key to each file in `js/translations/`. A key that's missing just shows the English.

**To add a language:** add it to `LANGUAGES` in `js/modules/i18n.js` and copy a file in `js/translations/` to the new code.

## Updating the CV PDFs

The PDFs are printed from `assets/cv/cv-en.html` and `assets/cv/cv-es.html`. Edit the HTML, open it in Edge or Chrome, print to PDF with margins set to **None** and headers and footers turned off, and save it over the old PDF.

## Contact

* **Email:** joaodaniel.jd@icloud.com
* **GitHub:** [jdanioliv](https://github.com/jdanioliv)
* **Location:** Barcelona, Spain
