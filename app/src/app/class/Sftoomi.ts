import moment from 'moment';

import Translator from './Translator';

import { CookiesService } from '../services/cookies-service.service';

export default class Sftoomi
{
    public static readonly Translator: Translator = new Translator();
    public static readonly Cookies: CookiesService = new CookiesService();

    /**
     * Returns current year number
     */
    public static getCurrentYear(): number
    {
        return (new Date()).getFullYear();
    }

    /**
     * Checks is variable an array
     *
     * @param variable
     */
    public static isArray(variable: any): boolean
    {
        return toString.apply(variable) === '[object Array]';
    }

    /**
     * Checks is variable a date
     *
     * @param variable
     */
    public static isDate(variable: any): boolean
    {
        return variable instanceof Date;
    }

    public static dateShort(date?: string | null | Date): string | null
    {
        if (!date) {
            return '';
        }

        return moment(date).format('MM/DD/YYYY');
    }

    /**
     * Formats line with passed arguments
     * Example:
     *  format: 'Our {0} project called {1}'
     *  args:   ['angular', 'SFTOOMI']
     *  Result: 'Our angular project called SFTOOMI'
     *
     * @param format
     * @param args
     */
    public static format(format: string, args: any[]): string
    {
        return format.replace(/\{(\d+)}/g, function(_m, i: number){
            return args[i];
        });
    }
}
