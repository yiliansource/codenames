export class i18n {
    public language: string = window.localStorage.getItem('lang') || 'en';
    public current: LanguageDefinition | undefined = undefined;

    constructor() {
        this.setLanguage(this.language);
    }

    setLanguage(lang: string) {
        if (definitions[lang] == undefined) {
            console.error(`No language with key '${lang}' exists. Translations might throw errors.`);
        }

        this.language = lang;
        this.current = definitions[lang];
    }
}

export interface LanguageDefinition {
    testMessage: string
}

const definitions: { [key: string] : LanguageDefinition } = {
    "de": {
        testMessage: "Hallo Welt!"
    },
    "en": {
        testMessage: "Hello World!"
    }
}

export default new i18n();