import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import moment from 'moment';

import Translator from './Translator';
import Dialog from './Dialog';
import Constants from './Constants'

import getMomentLocalDateFormat from '../locale/getMomentLocalDateFormat';

import CookiesService from '../services/cookies.service';
import ResponsiveLayoutService from '../services/responsive-layout.service';

export default class Sftoomi
{
    public static readonly Translator: Translator = new Translator();
    public static readonly Cookies: CookiesService = new CookiesService();
    public static readonly Dialog: Dialog = new Dialog();
    public static readonly Constants: Constants = new Constants();

    public static responsiveLayoutService: ResponsiveLayoutService | undefined = undefined;

    public static init(dialog: NzModalService, nzI18nService: NzI18nService, responsiveLayoutService: ResponsiveLayoutService): void
    {
        Sftoomi.Dialog.init(dialog);
        Sftoomi.Translator.init(nzI18nService)
        Sftoomi.responsiveLayoutService = responsiveLayoutService
    }

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
        return Array.isArray(variable);
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

    /**
     * @param date
     */
    public static dateShort(date?: string | null | Date): string
    {
        if (!date) {
            return '';
        }

        return moment(date).format(getMomentLocalDateFormat().date);
    }

    /**
     * @param date
     */
    public static stringToDate(date?: string | null | Date): Date | null
    {
        if (!date) {
            return null;
        }

        if (date instanceof Date) {
            return date
        }

        return moment(date).toDate();
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

    /**
     * Checks if the value is an object
     *
     * @param value
     */
    public static isObject(value: any): boolean
    {
        return !!value && Object.prototype.toString.call(value) === '[object Object]';
    }

    /**
     * Returns true if the passed value is empty, false otherwise
     *
     * @param value
     * @param allowBlank
     */
    public static isEmpty(value: any, allowBlank = false): boolean
    {
        return value === null
            || value === undefined
            || ((Sftoomi.isArray(value) && !value.length))
            || (!allowBlank ? value === '' : false);
    }

    /**
     * Returns human formatted name: Last F. M.
     *
     * 1st way: last, first, middle
     * 2nd way: array
     *
     * @param arg1
     * @param arg2
     * @param arg3
     */
    public static humanShortName(arg1: any, arg2?: any, arg3?: any): string
    {
        let last: string,
            first: string,
            middle: string;

        if (Sftoomi.isObject(arg1)) {
            last = arg1['last_name'];
            first = arg1['first_name'];
            middle = arg1['middle_name'];
        } else {
            last = arg1;
            first = arg2;
            middle = arg3;
        }

        last = last.trim();
        first = first.trim().substring(0, 1);
        if (first != '') {
            first += '.';
        }

        middle = middle.trim().substring(0, 1);
        if (middle != '') {
            middle += '.';
        }

        if (Sftoomi.isEmpty(first) && Sftoomi.isEmpty(middle) && !Sftoomi.isEmpty(last)) {
            return last;
        }

        return String(last + (last ? ', ' : '') + first + middle).trim();
    }

    /**
     * Returns human formatted name: Last First Middle
     *
     * 1st way: last, first, middle
     * 2nd way: array
     *
     * @param arg1
     * @param arg2
     * @param arg3
     */
    public static humanFullName(arg1: any, arg2?: any, arg3?: any): string
    {
        if (Sftoomi.isArray(arg1) && arg1.length === 0) {
            return '';
        }

        let last: string,
            first: string,
            middle: string;

        if (Sftoomi.isObject(arg1)) {
            last = arg1['last_name'];
            first = arg1['first_name'];
            middle = arg1['middle_name'];
        } else {
            last = arg1;
            first = arg2;
            middle = arg3;
        }

        last = last.trim();
        first = first.trim();
        middle = middle.trim();

        return Sftoomi.isEmpty(first) && Sftoomi.isEmpty(middle)
            ? last
            : String(last + (last ? ', ' : '') + first + ' ' + middle).trim();
    }

    public static removeArrayItemByIndex(array: any[], index: any): void
    {
        array.splice(index, 1);
    }

    public static getFormControlName(control: AbstractControl): string | undefined
    {
        return Object.keys(control.parent!.controls).find((name: string): boolean => control === control.parent!.get(name))
    }

    public static formValuesToFormData(formValues: object): FormData
    {
        let data: FormData = new FormData();
        for (const [key, value] of Object.entries(formValues)) {
            let val: any = value;

            if (val instanceof Date) {
                val = Sftoomi.dateShort(value);
            }

            data.append(key, val);
        }

        return data;
    }

    /**
     * Useful when you need first letter to be big in sentence
     *
     * @param input
     */
    public static capitalizeString(input: any): string
    {
        if (typeof input !== 'string') {
            return '';
        }
        return input[0].toUpperCase() + input.substring(1).toLowerCase();
    }

    /**
     * Useful in forms
     *
     * @param form
     * @param fieldName
     */
    public static isFieldRequired(form: FormGroup, fieldName: string): boolean
    {
        const fieldCtrl = form.get(fieldName);
        if (!fieldCtrl || !fieldCtrl.validator) {
            return false;
        }

        return fieldCtrl.hasValidator(Validators.required);
    }
}
