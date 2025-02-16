import {TuiLanguage, TUI_RUSSIAN_LANGUAGE, TUI_ENGLISH_LANGUAGE} from '@taiga-ui/i18n';

import enDictionary from '../locale/dictionaries/us';
import ruDictionary from '../locale/dictionaries/ru';

import Sftoomi from './Sftoomi';

import { CookiesService } from '../services/cookies-service.service';

import SftoomiCookie from '../enumerations/SftoomiCookies.enumeration';

import { AppLocale } from '../type/AppLocale';

export default class Translator
{
    private readonly fallbackLocale: AppLocale = 'en';
    private locale: AppLocale = this.fallbackLocale;

    private readonly availableLocales: AppLocale[] = [
        'en',
        'ru'
    ];

    constructor()
    {
        let cookiesLocale: string = new CookiesService().getCookie(SftoomiCookie.SFTOOMI_LOCALE);

        if (cookiesLocale) {
            this.locale = cookiesLocale as AppLocale;
        }
    }

    public getI18nLocale(): TuiLanguage
    {
        switch (this.locale) {
            case "ru":
                return TUI_RUSSIAN_LANGUAGE;
        }

        return TUI_ENGLISH_LANGUAGE;
    }

    public switchToTheNextLocale(): void
    {
        let me: this = this,
            nextLocaleIndex: number = this.availableLocales.findIndex((locale: AppLocale): boolean => locale === me.locale) + 1;

        if (nextLocaleIndex + 1 > this.availableLocales.length) {
            nextLocaleIndex = 0;
        }

        this.locale = this.availableLocales[nextLocaleIndex];

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

    public translate(value: string): string
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

        return String(translatedValue);
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
};
