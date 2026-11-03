# Portfolio | Joao Daniel De Paiva Oliveira

Hi! I'm **Joao Daniel De Paiva Oliveira** (*Maru* online), an IT systems (**SMR**) student in Barcelona moving into software development (**DAM**), with the long-term goal of working with **Python, data and AI**.

This repository is the source code of my personal portfolio, built from scratch with HTML, CSS and JavaScript and hosted on GitHub Pages.

**Live site:** https://jdanioliv.github.io/web-portflio/

---

## What's inside

* **Home page** (`index.html`): about me, skills, projects, a learning section and a small interactive terminal.
* **Interactive CV** (`cv.html`): my CV as a web page, with the same terminal and PDF downloads in English and Spanish (`assets/cv/`).
* **Lab**: three mini apps that run in the browser:
  * Text analyzer (JavaScript)
  * Server log analyzer (Python with PyScript, source in `python/log_analyzer.py`)
  * Task manager (JavaScript + `localStorage`)
* **Course pages** (`courses/`): the CS50x certificate and the outlines of the courses I'm taking.
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
python/log_analyzer.py  Log analyzer used by the Python lab app
courses/              One page per course
assets/cv/            CV PDFs (EN / ES) and the HTML they're printed from
assets/img/           Images (CS50x certificate)
```

## Roadmap

- [x] Project setup, Git and documentation
- [x] Responsive home page
- [x] Lab with JavaScript and Python mini apps
- [x] Redesign in English with an interactive CV
- **On hold:** user accounts (sign up / login), a per-user database and the security work that goes with them. Paused to focus on new projects.

## Updating the CV PDFs

The PDFs are printed from `assets/cv/cv-en.html` and `assets/cv/cv-es.html`. Edit the HTML, open it in Edge or Chrome, print to PDF with margins set to **None** and headers and footers turned off, and save it over the old PDF.

## Contact

* **Email:** joaodaniel.jd@icloud.com
* **GitHub:** [jdanioliv](https://github.com/jdanioliv)
* **Location:** Barcelona, Spain
