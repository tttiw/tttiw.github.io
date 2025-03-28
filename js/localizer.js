import TOML from 'https://cdn.skypack.dev/@ltd/j-toml';

class Localizer {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.init();
    }

    async init() {
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang) {
            this.currentLanguage = savedLang;
        } else {
            const browserLang = navigator.language.split('-')[0];
            if (browserLang === 'zh') {
                this.currentLanguage = 'zh';
            }
        }

        await this.loadTranslation(this.currentLanguage);
        this.updateContent();

        const elements = document.querySelectorAll('.language-selector-item');
        for (const element of elements) {
            element.addEventListener('click', async (event) => {
                this.currentLanguage = element.getAttribute('data-lang');
                localStorage.setItem('preferredLanguage', this.currentLanguage);
                await this.loadTranslation(this.currentLanguage);
                this.updateContent();
            });
        }
    }

    async loadTranslation(lang) {
        try {
            const response = await fetch(`locales/${lang}.toml`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const tomlText = await response.text();
            this.translations = TOML.parse(tomlText, { joiner: '\n' });
        } catch (error) {
            console.error('Error loading translations:', error);
            if (lang !== 'en') {
                this.currentLanguage = 'en';
                await this.loadTranslation('en');
            }
        }
    }

    getNestedTranslation(key) {
        return key.split('.').reduce((obj, i) => (obj && obj[i] !== undefined) ? obj[i] : null, this.translations);
    }

    updateContent() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getNestedTranslation(key);
            if (translation) {
                element.textContent = translation;
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.getNestedTranslation(key);
            if (translation) {
                element.setAttribute('placeholder', translation);
            }
        });
    }
}

const localizer = new Localizer();

export default localizer;