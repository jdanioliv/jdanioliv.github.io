// 1. MOBILE MENU
// Under 900px the nav links are hidden; the "Menu" button shows/hides them.
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('nav-links');

if (navToggle && navLinks) {
    function updateMenuButton() {
        const isOpen = navLinks.classList.contains('navbar__links--open');
        navToggle.setAttribute('aria-expanded', isOpen);
        navToggle.textContent = isOpen ? t('nav.close', 'Close') : t('nav.menu', 'Menu');
    }

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('navbar__links--open');
        updateMenuButton();
    });

    // Close the menu after choosing a section
    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('navbar__links--open');
            updateMenuButton();
        });
    });

    document.addEventListener('i18n:change', updateMenuButton);
}


// 2. LAB TABS
const tabButtons = document.querySelectorAll('.lab-tab');
const tabPanels = document.querySelectorAll('.lab-panel');

function openTab(targetId) {
    // Python: for button in tabButtons: ...
    tabButtons.forEach((button) => {
        const isActive = button.dataset.target === targetId;
        button.classList.toggle('lab-tab--active', isActive);
        button.setAttribute('aria-selected', isActive);
    });
    tabPanels.forEach((panel) => {
        panel.classList.toggle('lab-panel--active', panel.id === targetId);
    });

    // Python is only downloaded the first time its tab is opened
    if (targetId === 'app-python') {
        loadPyScriptEngine();
    }
}

tabButtons.forEach((button) => {
    button.addEventListener('click', () => openTab(button.dataset.target));
});

// Links like "Try it" in the Projects section open a specific tab
document.querySelectorAll('[data-open-tab]').forEach((link) => {
    link.addEventListener('click', () => openTab(link.dataset.openTab));
});


// 3. MINI APP: TEXT ANALYZER
const textInput = document.getElementById('analyzer-input');

if (textInput) {
    const charCountEl = document.getElementById('stat-chars');
    const noSpacesCountEl = document.getElementById('stat-no-spaces');
    const wordCountEl = document.getElementById('stat-words');
    const readTimeEl = document.getElementById('stat-time');
    const clearBtn = document.getElementById('analyzer-clear-btn');

    function updateTextStats() {
        const rawText = textInput.value;

        // Python: len(rawText)
        const charCount = rawText.length;
        // Remove spaces and line breaks before counting
        const noSpacesCount = rawText.replace(/\s/g, '').length;

        // Python: len(rawText.split())
        const cleanedText = rawText.trim();
        const wordCount = cleanedText === '' ? 0 : cleanedText.split(/\s+/).length;

        // Reading time at 200 words per minute
        const readingTimeSeconds = Math.ceil((wordCount / 200) * 60);

        charCountEl.textContent = charCount;
        noSpacesCountEl.textContent = noSpacesCount;
        wordCountEl.textContent = wordCount;
        readTimeEl.textContent = `${readingTimeSeconds}s`;
    }

    textInput.addEventListener('input', updateTextStats);

    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        updateTextStats();
        textInput.focus();
    });
}


// 4. MINI APP: PYTHON LOG ANALYZER (loads PyScript only when needed)
let isPyScriptLoaded = false;
let pythonStatus = 'idle';

// Python: PYTHON_STATUS = {"idle": {...}, "loading": {...}, ...}
const PYTHON_STATUS = {
    idle: { key: 'lab.statusIdle', english: 'Python: not loaded', badge: 'badge' },
    loading: { key: 'lab.statusLoading', english: 'Python: loading...', badge: 'badge badge--loading' },
    ready: { key: 'lab.statusReady', english: 'Python: ready', badge: 'badge badge--ready' },
    error: { key: 'lab.statusError', english: 'Python: error', badge: 'badge badge--error' },
};

function showPythonStatus(status) {
    const statusBadge = document.getElementById('py-engine-status');
    const { key, english, badge } = PYTHON_STATUS[status];

    pythonStatus = status;
    statusBadge.textContent = t(key, english);
    statusBadge.className = badge;

    if (status === 'error') {
        document.getElementById('py-loader-text').textContent =
            t('lab.logLoadError', 'Could not download PyScript. Check your internet connection.');
    }
}

// Rewrite the badge when the language changes (only the home page has it)
if (document.getElementById('py-engine-status')) {
    document.addEventListener('i18n:change', () => showPythonStatus(pythonStatus));
}

function loadPyScriptEngine() {
    // Don't download Python twice
    if (isPyScriptLoaded) return;
    isPyScriptLoaded = true;

    const loaderBox = document.getElementById('py-loader-box');
    const workspace = document.getElementById('py-workspace');

    showPythonStatus('loading');

    // PyScript engine
    const engine = document.createElement('script');
    engine.type = 'module';
    engine.src = 'https://pyscript.net/releases/2024.1.1/core.js';

    // My Python file (python/log_analyzer.py)
    const pythonFile = document.createElement('script');
    pythonFile.type = 'py';
    pythonFile.src = './python/log_analyzer.py';

    window.addEventListener('py:ready', () => {
        showPythonStatus('ready');
        loaderBox.classList.add('hidden');
        workspace.classList.remove('hidden');
    });

    engine.addEventListener('error', () => showPythonStatus('error'));

    document.head.appendChild(engine);
    document.body.appendChild(pythonFile);
}


// 5. MINI APP: TASK MANAGER (saved in localStorage)
const todoForm = document.getElementById('todo-form');

if (todoForm) {
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const todoBadge = document.getElementById('todo-count-badge');
    const STORAGE_KEY = 'portfolio-tasks';

    // Each task is an object: { text: "...", done: false }
    // Python: tasks = json.loads(saved) if saved else []
    function loadTasks() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch {
            return [];
        }
    }

    function saveTasks(tasks) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch {
            // Storage blocked (private mode): the list still works until the page closes
        }
    }

    let tasks = loadTasks();

    function renderTasks() {
        todoList.innerHTML = '';

        if (tasks.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'todo__empty';
            empty.textContent = t('lab.todoEmpty', 'No tasks yet. Add one above.');
            todoList.appendChild(empty);
        }

        tasks.forEach((task, index) => {
            const item = document.createElement('li');
            if (task.done) item.classList.add('todo__item--done');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `task-${index}`;
            checkbox.checked = task.done;
            checkbox.addEventListener('change', () => {
                task.done = checkbox.checked;
                saveTasks(tasks);
                renderTasks();
            });

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = task.text;

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'todo__delete';
            deleteBtn.textContent = t('lab.todoDelete', 'Delete');
            deleteBtn.addEventListener('click', () => {
                // Python: tasks.pop(index)
                tasks.splice(index, 1);
                saveTasks(tasks);
                renderTasks();
            });

            item.append(checkbox, label, deleteBtn);
            todoList.appendChild(item);
        });

        // Python: sum(1 for t in tasks if not t["done"])
        const pending = tasks.filter((task) => !task.done).length;
        todoBadge.textContent = t('lab.todoPending', '{count} pending', { count: pending });
    }

    // Rewrite the list when the language changes
    document.addEventListener('i18n:change', renderTasks);

    todoForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const text = todoInput.value.trim();
        if (text === '') return;

        tasks.push({ text: text, done: false });
        saveTasks(tasks);
        renderTasks();
        todoInput.value = '';
    });

    renderTasks();
}
