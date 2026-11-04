// INTERACTIVE TERMINAL
// Used on index.html and cv.html. Every <div data-terminal> on the page becomes a terminal.

// Answers for each command, in English. In Python this would be a dict: {"help": "...", ...}
// The commands themselves (whoami, skills...) are never translated, only their answers.
const COMMANDS = {
    help: 'Commands: whoami, skills, projects, contact, cv, clear',
    whoami: 'Joao Daniel De Paiva Oliveira (aka Maru)\n' +
            'IT systems student (SMR) at Digitech FP, Barcelona.\n' +
            'Learning Python, Java and web development.\n' +
            'Goal: working with data and AI.',
    skills: 'Programming: Python, Java, JavaScript, HTML, CSS, C++, SQL, Luau\n' +
            'Systems:     Windows, Windows Server, Linux, Bash, PowerShell\n' +
            'Networks:    LAN / WLAN, IPv4, DNS\n' +
            'Tools:       Git, GitHub, VS Code, VirtualBox',
    projects: '1. Server log analyzer (Python)\n' +
              '2. Interactive CV\n' +
              '3. This portfolio\n' +
              'More details in the Projects section.',
    contact: 'Open to: paid internships (FP prácticas) and junior roles\n' +
             'Email:   joaodaniel.jd@icloud.com\n' +
             'GitHub:  github.com/jdanioliv',
};

// CV files offered by the "cv" command
const CV_FILES = [
    { label: 'English', href: 'assets/cv/CV_Joao_Daniel_de_Paiva_Oliveira_EN.pdf' },
    { label: 'Español', href: 'assets/cv/CV_Joao_Daniel_de_Paiva_Oliveira_ES.pdf' },
];

function setUpTerminal(terminal) {
    const output = terminal.querySelector('.terminal__output');
    const input = terminal.querySelector('.terminal__input');
    const body = terminal.querySelector('.terminal__body');

    // Adds one block of text to the screen (textContent, so nothing is read as HTML)
    function print(text, className) {
        const line = document.createElement('div');
        line.className = 'terminal__line' + (className ? ' ' + className : '');
        line.textContent = text;
        output.appendChild(line);
        return line;
    }

    function printCvLinks() {
        const line = print(t('terminal.cv', 'Download my CV:') + ' ');
        CV_FILES.forEach((file, index) => {
            const link = document.createElement('a');
            link.href = file.href;
            link.textContent = file.label;
            link.className = 'terminal__link';
            link.setAttribute('download', '');
            line.appendChild(link);
            if (index < CV_FILES.length - 1) {
                line.append(' · ');
            }
        });
    }

    function run(rawCommand) {
        const command = rawCommand.trim().toLowerCase();
        print('maru@portfolio:~$ ' + rawCommand, 'terminal__prompt');

        if (command === '') {
            // Empty line: nothing to do
        } else if (command === 'clear') {
            output.innerHTML = '';
        } else if (command === 'cv') {
            printCvLinks();
        } else if (command in COMMANDS) {
            print(t(`terminal.${command}`, COMMANDS[command]));
        } else {
            print(t('terminal.notFound', 'Command not found: {command}. Type "help".', { command }), 'terminal__error');
        }

        input.value = '';
        body.scrollTop = body.scrollHeight;
    }

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            run(input.value);
        }
    });

    // Clicking anywhere in the terminal puts the cursor in the input
    body.addEventListener('click', () => input.focus());

    // Quick command buttons under the terminal
    terminal.querySelectorAll('[data-command]').forEach((button) => {
        button.addEventListener('click', () => run(button.dataset.command));
    });

    function start() {
        output.innerHTML = '';
        print(t('terminal.welcome', 'Welcome! Type "help" to see the commands.'), 'terminal__accent');

        // Optional first command, e.g. data-autorun="whoami"
        if (terminal.dataset.autorun) {
            run(terminal.dataset.autorun);
        }
    }

    start();

    // When the language changes, start again so everything on screen is in the new language
    document.addEventListener('i18n:change', start);

    // The web fonts can change how lines wrap once they load, so scroll down again
    document.fonts.ready.then(() => {
        body.scrollTop = body.scrollHeight;
    });
}

document.querySelectorAll('[data-terminal]').forEach(setUpTerminal);
