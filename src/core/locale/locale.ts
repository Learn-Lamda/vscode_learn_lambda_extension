export abstract class Locale {
    abstract writeToken(): string;
}


export class RuLocale extends Locale {
    writeToken = (): string => 'Введитте токен';
}

export class EngLocale extends Locale {
    writeToken = (): string => 'Write token';
}


export class CurrentLocale {
    locale!: Locale;
    constructor(locale: string) {
        if (locale === 'en') {
            this.locale = new EngLocale();
        } else {
            this.locale = new RuLocale();
        }
    }
}
