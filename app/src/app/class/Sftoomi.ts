import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { DateTime } from 'luxon';

import Translator from './Translator';
import Dialog from './Dialog';
import Constants from './Constants';
import Auth from './Auth';

import getLocalDateFormat from '../locale/getLocalDateFormat';

import CookiesService from '../services/cookies.service';
import ResponsiveLayoutService from '../services/responsive-layout.service';
import PopupMsgService from '../services/popup-msg.service';

import Gender from '../type/Gender';

export default class Sftoomi
{
    public static readonly Translator: Translator = new Translator();
    public static readonly Cookies: CookiesService = new CookiesService();
    public static readonly Dialog: Dialog = new Dialog();
    public static readonly Constants: Constants = new Constants();
    public static readonly Auth: Auth = new Auth();

    public static responsiveLayoutService: ResponsiveLayoutService | undefined = undefined;
    public static popupMsgService: PopupMsgService | undefined;

    private static applicationGlobalMaskShown: boolean = false;

    /**
     * Initializes global application services and utilities.
     *
     * @param dialog                  - Modal service instance
     * @param nzI18nService           - NG-ZORRO i18n service instance
     * @param responsiveLayoutService - Responsive layout service instance
     * @param popupMsgService         - Popup message service instance
     */
    public static init(
        dialog: NzModalService,
        nzI18nService: NzI18nService,
        responsiveLayoutService: ResponsiveLayoutService,
        popupMsgService: PopupMsgService
    ): void
    {
        Sftoomi.Dialog.init(dialog);
        Sftoomi.Translator.init(nzI18nService);
        Sftoomi.responsiveLayoutService = responsiveLayoutService;
        Sftoomi.popupMsgService = popupMsgService;
    }

    /**
     * Returns the current year as a number.
     *
     * @returns The current four-digit year
     */
    public static getCurrentYear(): number
    {
        return (new Date()).getFullYear();
    }

    /**
     * Checks whether the given variable is an array.
     *
     * @param variable - The value to check
     * @returns True if the variable is an array, false otherwise
     */
    public static isArray(variable: any): boolean
    {
        return Array.isArray(variable);
    }

    /**
     * Checks whether the given variable is a native JavaScript Date instance.
     *
     * @param variable - The value to check
     * @returns True if the variable is a Date instance, false otherwise
     */
    public static isDate(variable: any): boolean
    {
        return variable instanceof Date;
    }

    /**
     * Formats a date into a short date string based on the local configuration.
     *
     * @param date - The date value to format (string, Date, or null/undefined)
     * @returns Formatted short date string, or an empty string if invalid
     */
    public static dateShort(date?: string | null | Date): string
    {
        let luxonDate: DateTime | null = this.parseDateToLuxon(date);
        if (!luxonDate || !luxonDate.isValid) {
            return '';
        }

        return luxonDate.toFormat(getLocalDateFormat().date);
    }

    /**
     * Formats a date and time into a string based on the local configuration.
     *
     * @param date - The date value to format (string, Date, or null/undefined)
     * @returns Formatted date and time string, or an empty string if invalid
     */
    public static dateTime(date?: string | null | Date): string
    {
        let luxonDate: DateTime | null = this.parseDateToLuxon(date);
        if (!luxonDate || !luxonDate.isValid) {
            return '';
        }

        return luxonDate.toFormat(getLocalDateFormat().date_time);
    }

    /**
     * Tries to convert any value into a valid JavaScript Date object.
     * Supports Date instances, Luxon DateTime objects, timestamps (sec/ms),
     * ISO/RFC formats, and various custom date string formats.
     *
     * @param value - The value to parse into a Date object
     * @returns A valid JS Date instance, or null if parsing fails
     */
    public static toDate(value?: unknown): Date | null
    {
        if (value === null || value === undefined) {
            return null;
        }

        if (value instanceof Date) {
            return isNaN(value.getTime()) ? null : value;
        }

        if (DateTime.isDateTime(value)) {
            return value.isValid ? value.toJSDate() : null;
        }

        type LuxonParseResult = DateTime<true> | DateTime<false>;

        if (typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value.trim()))) {
            const num: number = Number(value);
            if (!isNaN(num)) {
                // Check length: <= 10 digits -> seconds, > 10 digits -> milliseconds
                const dt: LuxonParseResult = num.toString().length <= 10 ? DateTime.fromSeconds(num) : DateTime.fromMillis(num);
                if (dt.isValid) {
                    return dt.toJSDate();
                }
            }
        }

        if (typeof value === 'string') {
            const trimmed: string = value.trim();
            if (!trimmed) {
                return null;
            }

            // Standard ISO 8601 & RFC 2822 formats
            let dt: LuxonParseResult = DateTime.fromISO(trimmed);
            if (dt.isValid) {
                return dt.toJSDate();
            }

            dt = DateTime.fromRFC2822(trimmed);
            if (dt.isValid) {
                return dt.toJSDate();
            }

            // Common custom date & time formats
            const popularFormats: string[] = [
                // With time (24h)
                'yyyy-MM-dd HH:mm:ss',
                'yyyy-MM-dd HH:mm',
                'dd.MM.yyyy HH:mm:ss',
                'dd.MM.yyyy HH:mm',
                'dd/MM/yyyy HH:mm:ss',
                'dd/MM/yyyy HH:mm',
                'MM/dd/yyyy HH:mm:ss',

                // Date only
                'yyyy-MM-dd',
                'dd.MM.yyyy',
                'dd/MM/yyyy',
                'MM/dd/yyyy',
                'yyyy.MM.dd',
                'yyyy/MM/dd',

                // Short years and compact formats
                'dd-MM-yyyy',
                'dd.MM.yy',
                'dd/MM/yy',
                'yyyyMMdd'
            ];

            for (const format of popularFormats) {
                dt = DateTime.fromFormat(trimmed, format);
                if (dt.isValid) {
                    return dt.toJSDate();
                }
            }

            // 4.3. Native Date fallback for non-standard browser/system strings
            const fallbackTimestamp: number = Date.parse(trimmed);
            if (!isNaN(fallbackTimestamp)) {
                return new Date(fallbackTimestamp);
            }
        }

        // 5. Fallback if no format matched
        return null;
    }

    /**
     * Formats a template string by replacing placeholders with passed arguments.
     * Example:
     *  format: 'Our {0} project called {1}'
     *  args:   ['angular', 'SFTOOMI']
     *  Result: 'Our angular project called SFTOOMI'
     *
     * @param format - The template string with indexed placeholders (e.g. {0}, {1})
     * @param args - An array of values to inject into placeholders
     * @returns The formatted string
     */
    public static format(format: string, args: any[]): string
    {
        return format.replace(/\{(\d+)}/g, function(_m, i: number){
            return args[i];
        });
    }

    /**
     * Checks whether the given value is a plain JavaScript object.
     *
     * @param value - The value to check
     * @returns True if the value is a plain object, false otherwise
     */
    public static isObject(value: any): boolean
    {
        return !!value && Object.prototype.toString.call(value) === '[object Object]';
    }

    /**
     * Checks whether the passed value is considered empty (null, undefined, empty array, or empty string).
     *
     * @param value - The value to check
     * @param allowBlank - Whether to treat an empty string '' as non-empty (default: false)
     * @returns True if the value is empty, false otherwise
     */
    public static isEmpty(value: any, allowBlank = false): value is null | undefined | ''
    {
        return value === null
            || value === undefined
            || ((Sftoomi.isArray(value) && !value.length))
            || (!allowBlank ? value === '' : false);
    }

    /**
     * Returns a human-formatted short name in the format: Last F. M.
     * Supports passing either an object with name properties or individual arguments.
     *
     * @param arg1 - An object containing last_name, first_name, and middle_name, or the last name string
     * @param arg2 - The first name string (if arg1 is a string)
     * @param arg3 - The middle name string (if arg1 is a string)
     * @returns Formatted short name string
     */
    public static humanShortName(arg1: any, arg2?: any, arg3?: any): string
    {
        let last:   string,
            first:  string,
            middle: string;

        if (Sftoomi.isObject(arg1)) {
            last   = arg1['last_name'];
            first  = arg1['first_name'];
            middle = arg1['middle_name'];
        } else {
            last   = arg1 ?? '';
            first  = arg2 ?? '';
            middle = arg3 ?? '';
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
     * Returns a human-formatted full name in the format: Last, First Middle.
     * Supports passing either an object with name properties or individual arguments.
     *
     * @param arg1 - An object containing last_name, first_name, and middle_name, or an array/last name string
     * @param arg2 - The first name string (if arg1 is a string)
     * @param arg3 - The middle name string (if arg1 is a string)
     * @returns Formatted full name string
     */
    public static humanFullName(arg1: any, arg2?: any, arg3?: any): string
    {
        if (Sftoomi.isArray(arg1) && arg1.length === 0) {
            return '';
        }

        let last:   string,
            first:  string,
            middle: string;

        if (Sftoomi.isObject(arg1)) {
            last   = arg1['last_name'];
            first  = arg1['first_name'];
            middle = arg1['middle_name'];
        } else {
            last   = arg1;
            first  = arg2;
            middle = arg3;
        }

        last   = last.trim();
        first  = first.trim();
        middle = middle.trim();

        return Sftoomi.isEmpty(first) && Sftoomi.isEmpty(middle)
            ? last
            : String(last + (last ? ', ' : '') + first + ' ' + middle).trim();
    }

    /**
     * Removes an item from an array at the specified index in-place.
     *
     * @param array - The target array
     * @param index - The index of the item to remove
     */
    public static removeArrayItemByIndex(array: any[], index: any): void
    {
        array.splice(index, 1);
    }

    /**
     * Finds and returns the form control name within its parent FormGroup.
     *
     * @param control - The AbstractControl instance to inspect
     * @returns The name of the control, or undefined if not found
     */
    public static getFormControlName(control: AbstractControl): string | undefined
    {
        return Object.keys(control.parent!.controls).find((name: string): boolean => control === control.parent!.get(name));
    }

    /**
     * Converts an object of form values into a FormData instance, formatting dates as short strings.
     *
     * @param formValues - An object containing form key-value pairs
     * @returns Populated FormData object
     */
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
     * Capitalizes the first letter of a string and converts the rest to lowercase.
     *
     * @param input - The string to capitalize
     * @returns Capitalized string, or an empty string if input is not a string
     */
    public static capitalizeString(input: any): string
    {
        if (typeof input !== 'string') {
            return '';
        }
        return input[0].toUpperCase() + input.substring(1).toLowerCase();
    }

    /**
     * Checks whether a specific form field has the Validators.required validator attached.
     *
     * @param form      - The parent FormGroup instance
     * @param fieldName - The name of the form control field
     * @returns True if the field is required, false otherwise
     */
    public static isFieldRequired(form: FormGroup, fieldName: string): boolean
    {
        const fieldCtrl = form.get(fieldName);
        if (!fieldCtrl || !fieldCtrl.validator) {
            return false;
        }

        return fieldCtrl.hasValidator(Validators.required);
    }

    /**
     * Merges properties of the second object into the first using object spread syntax.
     *
     * @param where - The base object
     * @param what  - The object containing properties to merge or override
     * @returns A new merged object
     */
    public static mergeObjects(where: Object, what: Object): object
    {
        return {
            ...where,
            ...what
        };
    }

    /**
     * Compares two Date objects to check if they fall on the same day, month, and year.
     *
     * @param firstDate  - The first date to compare
     * @param secondDate - The second date to compare
     * @returns True if both dates match by day, month, and year
     */
    public static twoDatesEqual(firstDate: Date, secondDate: Date): boolean
    {
        return firstDate.getDate()     === secondDate.getDate()
            && firstDate.getMonth()    === secondDate.getMonth()
            && firstDate.getFullYear() === secondDate.getFullYear();
    }

    /**
     * Checks if the passed method exists and executes it, returning its result.
     *
     * @param method - An optional function to execute
     * @returns The result of the function execution, or undefined
     */
    public static runMethodIfExists(method?: Function): any
    {
        if (method) {
            return method();
        }
    }

    /**
     * Converts a number or numeric value into its localized ordinal string representation (e.g., 1st, 2nd, 1-й).
     *
     * @param value - The input value to convert
     * @returns Formatted ordinal string, or empty string on failure
     */
    public static numberToOrdinal(value: any): string
    {
        let num: number;
        try {
            num = parseInt(value);
        } catch {
            return '';
        }

        num++; // because the order starts from 0

        if (num <= 0) {
            return '';
        }

        const prefix: string = num + '-',
              lastDigit: number  = num % 10,
              lastTwoDigits: number = num % 100;

        switch (Sftoomi.Translator.getLocale()) {
            case 'ru':
                return prefix + (lastTwoDigits >= 11 && lastTwoDigits <= 19 ? 'ый' : lastDigit === 2 ? 'ой' : lastDigit === 3 ? 'ий' : 'ый');
            case 'us':
                return prefix + (lastTwoDigits >= 11 && lastTwoDigits <= 13 ? 'th' : lastDigit === 1 ? 'st' : lastDigit === 2 ? 'nd' : lastDigit === 3 ? 'rd' : 'th');
        }
    }

    /**
     * Creates a deep clone of the provided entity using JSON serialization.
     *
     * @param entity - The entity to duplicate
     * @returns A brand new deep copy of the entity
     */
    public static duplicateEntity<T = any>(entity: any): T
    {
        return JSON.parse(JSON.stringify(entity));
    }

    /**
     * Shows the global application loading/blocking mask.
     */
    public static showApplicationGlobalMask(): void
    {
        this.applicationGlobalMaskShown = true;
    }

    /**
     * Hides the global application loading/blocking mask.
     */
    public static hideApplicationGlobalMask(): void
    {
        this.applicationGlobalMaskShown = false;
    }

    /**
     * Checks whether the global application mask is currently shown.
     *
     * @returns True if the mask is active, false otherwise
     */
    public static isApplicationGlobalMaskShown(): boolean
    {
        return this.applicationGlobalMaskShown;
    }

    /**
     * Parses and normalizes a gender value into a valid Gender enum or code.
     *
     * @param value - The raw gender value to parse
     * @returns Valid gender number (0 or 1), or -1 if unspecified/invalid
     */
    public static parseGender(value: any): Gender
    {
        const unspecified = -1;
        if (value === null || value === undefined || this.isEmpty(value)) {
            return unspecified;
        }

        if (typeof value !== 'string' && typeof value !== 'number') {
            return unspecified;
        }

        let numericValue: number;
        if (typeof value === 'string') {
            numericValue = parseInt(value);

            if (isFinite(numericValue) || isNaN(numericValue)) {
                return unspecified;
            }
        } else {
            numericValue = value;
        }

        if (numericValue !== 1 && numericValue !== 0) {
            return unspecified;
        }

        return numericValue;
    }

    /**
     * Internal helper to parse date strings or objects into a Luxon DateTime instance.
     *
     * @param date - The date value to parse
     * @returns Luxon DateTime instance, or null if parsing fails
     */
    private static parseDateToLuxon(date?: string | null | Date): DateTime | null
    {
        if (!date) {
            return null;
        }

        let luxonDate;
        if (date instanceof Date) {
            luxonDate = DateTime.fromJSDate(date);
        } else {
            luxonDate = DateTime.fromISO(date.toString());
            if (!luxonDate.isValid) {
                luxonDate = DateTime.fromSQL(date);
            }
        }

        return luxonDate;
    }
}
