document.addEventListener('DOMContentLoaded', function () {

    const terminal = document.getElementById('python-terminal');
    const runButton = document.getElementById('run-code-btn');
    const clearButton = document.getElementById('clear-terminal-btn');
    const resetButton = document.getElementById('reset-env-btn');
    const maximizeButton = document.getElementById('maximize-terminal-btn');

    if (!terminal || !runButton) return;

    const customStyleLink = document.createElement('link');
    customStyleLink.rel = 'stylesheet';
    customStyleLink.href = 'mini_terminal.css';
    document.head.appendChild(customStyleLink);

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
    <div class="modal-content">
        <div class="modal-header">
            <h2>Terminal Output</h2>
            <button class="close-modal">X</button>
        </div>
        <div class="modal-terminal" id="modal-terminal-content"></div>
    </div>
`;

    document.body.appendChild(modal);

    const closeModalBtn = modal.querySelector('.close-modal');
    const modalTerminal = document.getElementById('modal-terminal-content');

    addOnButtonClickListener(maximizeButton, function () {
        modalTerminal.innerHTML = terminal.innerHTML;
        modal.style.display = 'block';

        setTimeout(() => {
            modal.classList.add('visible');
        }, 10);

        modalTerminal.scrollTop = modalTerminal.scrollHeight;
    });

    closeModalBtn.addEventListener('click', function () {
        closeModal();
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('visible');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 200);
    }

    const codeEditor = CodeMirror.fromTextArea(document.getElementById('python-code-editor'), {
        mode: 'python',
        theme: 'zenburn',
        lineNumbers: true,
        indentUnit: 4,
        smartIndent: true,
        indentWithTabs: true,
        lineWrapping: true,
        styleActiveLine: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        extraKeys: {
            'Ctrl-Enter': runPythonCode
        }
    });

    let pyodide = null;
    let isLoadingPyodide = false;

    initialHints();

    async function loadPyodide() {
        if (pyodide !== null) return pyodide;
        if (isLoadingPyodide) return null;

        isLoadingPyodide = true;
        appendToTerminal('Loading Python env...', 'terminal-info');

        try {
            pyodide = await globalThis.loadPyodide();
            await pyodide.loadPackage("micropip");
            //const micropip = pyodide.pyimport("micropip");
            appendToTerminal('Python env ready', 'terminal-success');
        } catch (error) {
            appendToTerminal(`Failed loading Python env: ${error}`, 'terminal-error');
            console.error('Failed loading Python env', error);
        } finally {
            isLoadingPyodide = false;
        }

        return pyodide;
    }

    function appendToTerminal(text, className = '') {
        const output = document.createElement('div');
        output.className = `terminal-output ${className}`;
        output.textContent = text;
        terminal.appendChild(output);
        terminal.scrollTop = terminal.scrollHeight;

        if (modal.style.display === 'block') {
            const modalOutput = document.createElement('div');
            modalOutput.className = `terminal-output ${className}`;
            modalOutput.textContent = text;
            modalTerminal.appendChild(modalOutput);
            modalTerminal.scrollTop = modalTerminal.scrollHeight;
        }
    }

    async function runPythonCode() {
        const code = codeEditor.getValue();

        if (!code.trim()) {
            return;
        }

        const codeLines = code.split('\n').filter(line => line.trim() !== '');
        const lineCount = codeLines.length;

        if (lineCount === 1) {
            appendToTerminal(`> ${codeLines[0]}`, 'terminal-input');
        } else {
            appendToTerminal(`> [${lineCount} lines of Python code executed]`, 'terminal-input');
        }

        const pyodideInstance = pyodide || await loadPyodide();
        if (!pyodideInstance) {
            appendToTerminal('Python env not ready. Try again later.', 'terminal-error');
            return;
        }

        try {
            await pyodideInstance.runPythonAsync(`
        import sys
        from io import StringIO
        sys.stdout = StringIO()
        sys.stderr = StringIO()
    `);

            await pyodideInstance.runPythonAsync(code);

            const stdout = await pyodideInstance.runPythonAsync("sys.stdout.getvalue()");
            const stderr = await pyodideInstance.runPythonAsync("sys.stderr.getvalue()");

            await pyodideInstance.runPythonAsync(`
        sys.stdout = sys.__stdout__
        sys.stderr = sys.__stderr__
    `);

            if (stdout) appendToTerminal(stdout);
            if (stderr) appendToTerminal(stderr, 'terminal-error');

        } catch (error) {
            appendToTerminal(`Error: ${error.message}`, 'terminal-error');
        }
    }

    function clearTerminal() {
        terminal.innerHTML = '';
        initialHints();
    }

    function initialHints() {
        appendToTerminal("Mini Terminal for Python", "terminal-info");
        if (!pyodide) {
            appendToTerminal("Python env will be loaded on first execution", "terminal-info");
        }
    }

    async function resetPyodideEnv() {
        pyodide = null;
        clearTerminal();
        appendToTerminal('Python env reset', 'terminal-info');
    }

    addOnButtonClickListener(runButton, runPythonCode);

    if (clearButton) {
        addOnButtonClickListener(clearButton, clearTerminal);
    }

    if (resetButton) {
        addOnButtonClickListener(resetButton, resetPyodideEnv);
    }


});