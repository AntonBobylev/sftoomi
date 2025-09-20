import { en_US, NzI18nService, ru_RU } from 'ng-zorro-antd/i18n';

import enDictionary from '../locale/dictionaries/us';
import ruDictionary from '../locale/dictionaries/ru';

import Sftoomi from './Sftoomi';

import CookiesService from '../services/cookies.service';

import SftoomiCookie from '../enumerations/SftoomiCookies.enumeration';

import { AppLocale } from '../type/AppLocale';

export enum TranslationOptions {
    BRACES_AROUND,
    UPPERCASE,
    LOWERCASE,
    CAPITALIZE
}

export default class Translator
{
    private readonly fallbackLocale: AppLocale = 'us';
    private locale: AppLocale = this.fallbackLocale;

    private readonly availableLocales: AppLocale[] = [
        'us',
        'ru'
    ];

    private initialized: boolean = false;

    private i18n!: NzI18nService;

    constructor()
    {
        let cookiesLocale: string = new CookiesService().getCookie(SftoomiCookie.SFTOOMI_LOCALE);

        if (cookiesLocale) {
            this.locale = cookiesLocale as AppLocale;
        }
    }

    public init(i18n: NzI18nService): void
    {
        this.i18n = i18n;

        this.initialized = true;

        this.applyFrameworkLocale();
    }

    public switchToTheNextLocale(): void
    {
        let me: this = this,
            nextLocaleIndex: number = this.availableLocales.findIndex((locale: AppLocale): boolean => locale === me.locale) + 1;

        if (nextLocaleIndex + 1 > this.availableLocales.length) {
            nextLocaleIndex = 0;
        }

        this.locale = this.availableLocales[nextLocaleIndex];

        if (this.initialized) {
            this.applyFrameworkLocale();
        }

        Sftoomi.Cookies.setCookie(
            SftoomiCookie.SFTOOMI_LOCALE,
            this.locale,
            1825 // 5 years
        );

        window.location.reload();
    }

    public getLocale(): AppLocale
    {
        return this.locale;
    }

    public translate(value: string, options: TranslationOptions[] = []): string
    {
        let dictionary: object = this.getDictionary(),
            translatedValue: string | undefined = dictionary[value as keyof object];

        if (!translatedValue) {
            // try to find as a path
            translatedValue = this.lookupByPath(dictionary, value);
        }

        if (!translatedValue) {
            console.warn(`No translation has been found for "${value}" for ${this.locale} locale`);
            translatedValue = value;
        }

        translatedValue = String(translatedValue);

        if (options.includes(TranslationOptions.CAPITALIZE)) {
            translatedValue = Sftoomi.capitalizeString(translatedValue);
        } else if (options.includes(TranslationOptions.LOWERCASE)) {
            translatedValue = translatedValue.toLowerCase();
        } else if (options.includes(TranslationOptions.UPPERCASE)) {
            translatedValue = translatedValue.toUpperCase();
        }

        if (options.includes(TranslationOptions.BRACES_AROUND)) {
            translatedValue = '(' +  translatedValue + ')';
        }

        return translatedValue;
    }

    /**
     * Stolen from here: https://stackoverflow.com/a/8817531
     * @param obj
     * @param path
     *
     * @private
     */
    private lookupByPath(obj: any, path: string): string | undefined
    {
        try {
            let parts = path.split('.');
            if (parts.length == 1) {
                return obj[parts[0]];
            }

            return this.lookupByPath(obj[parts[0]], parts.slice(1).join('.'));
        } catch (e) {
            return undefined;
        }
    }

    private getDictionary(): object
    {
        switch (this.locale) {
            case 'ru':
                return ruDictionary;
        }

        return enDictionary;
    }

    private applyFrameworkLocale(): void
    {
        let frameworkLocale;
        switch (this.locale) {
            case 'ru':
                frameworkLocale = ru_RU;
                break;
            case 'us':
            default:
                frameworkLocale = en_US;
                break;

        }

        this.i18n.setLocale(frameworkLocale);
    }
};
