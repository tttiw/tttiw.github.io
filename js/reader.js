async function loadBlogContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const blogFile = urlParams.get('blog');

    try {
        const response = await fetch(`/blogs/${blogFile}`);
        if (!response.ok) throw new Error('Blog not found');

        const markdown = await response.text();

        const { Marked } = globalThis.marked;
        const { markedHighlight } = globalThis.markedHighlight;

        const marked = new Marked(
            markedHighlight({
                emptyLangClass: 'hljs',
                langPrefix: 'hljs language-',
                highlight(code, lang, info) {
                    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                    return hljs.highlight(code, { language }).value;
                }
            })
        );

        marked.use({

            renderer: {
                code(code) {
                    const codeText = code.text;
                    const codeLang = code.lang || 'plaintext';

                    return `<pre data-language="${codeLang}"><button class="copy-button" onclick="copyCodeToClipboard(this)">copy</button><code class="hljs language-${codeLang}">${codeText}</code></pre>`;
                },

                link(link) {
                    const href = link.href;
                    const title = link.title;
                    const text = link.text;

                    if (href.startsWith('@blogs/')) {
                        const blogFile = href.substring(6); // Remove '@blog/'
                        return `<a href="?blog=${encodeURIComponent(blogFile)}" ${title ? `title="${title}"` : ''}>${text}</a>`;
                    }

                    return `<a href="${href}" ${title ? `title="${title}"` : ''} target="_blank" rel="noopener noreferrer">${text}</a>`;
                }

            },

            extensions: [{
                name: 'math',
                level: 'inline',
                start(src) { return src.match(/\$/)?.index; },
                tokenizer(src) {
                    const match = src.match(/^\$([^$]+)\$/);
                    if (match) {
                        return {
                            type: 'math',
                            raw: match[0],
                            text: match[1].trim()
                        };
                    }
                },
                renderer(token) {
                    return katex.renderToString(token.text, {
                        throwOnError: false,
                        displayMode: false
                    });
                }
            }, {
                name: 'math',
                level: 'block',
                start(src) { return src.match(/\$\$/)?.index; },
                tokenizer(src) {
                    const match = src.match(/^\$\$([^$]+)\$\$/);
                    if (match) {
                        return {
                            type: 'math',
                            raw: match[0],
                            text: match[1].trim()
                        };
                    }
                },
                renderer(token) {
                    return katex.renderToString(token.text, {
                        throwOnError: false,
                        displayMode: true
                    });
                }
            }]
        });

        const content = document.getElementById('content');
        content.innerHTML = marked.parse(markdown);

        const h1 = content.querySelector('h1');
        if (h1) {
            const titleText = h1.textContent;
            document.getElementById('articleTitle').textContent = titleText;
            document.title = `${titleText}`;
            document.getElementById('articleTitle').textContent = h1.textContent;
            h1.remove();
        }
    } catch (error) {
        console.error('Error loading blog:', error);
        document.getElementById('content').innerHTML = `<p>${error.message}</p>`;
    }
}

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('light-mode');

    const isDarkMode = !body.classList.contains('light-mode');

    const highlightStyleLink = document.querySelector('link[href*="highlight.js"]');

    if (isDarkMode) {
        highlightStyleLink.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css";
    } else {
        highlightStyleLink.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css";
    }

    document.querySelectorAll('pre code').forEach((block) => {
        block.removeAttribute('data-highlighted');
        hljs.highlightElement(block);
    });

    localStorage.setItem('blogDarkMode', isDarkMode);
}

document.addEventListener('DOMContentLoaded', () => {
    const savedDarkMode = localStorage.getItem('blogDarkMode');

    if (savedDarkMode !== null) {
        const isDarkMode = savedDarkMode === 'true';

        if (!isDarkMode) {
            toggleDarkMode();
        }
    }
});

function copyCodeToClipboard(buttonElement) {
    const preElement = buttonElement.parentElement;
    const codeElement = preElement.querySelector('code');
    const code = codeElement.innerText;

    navigator.clipboard.writeText(code).then(() => {
        buttonElement.textContent = 'copied';
        buttonElement.classList.add('copy-feedback');

        setTimeout(() => {
            buttonElement.textContent = 'copy';
            setTimeout(() => {
                buttonElement.classList.remove('copy-feedback');
            }, 50);
        }, 2000);
    }).catch(err => {
        console.error(err);
        buttonElement.textContent = 'failed';

        setTimeout(() => {
            buttonElement.textContent = 'copy';
        }, 2000);
    });
}

document.addEventListener('DOMContentLoaded', loadBlogContent);