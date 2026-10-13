import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import Sftoomi from './Sftoomi';

describe('Sftoomi Utility Class', (): void => {
    beforeEach((): void => {
        Sftoomi.hideApplicationGlobalMask();
    });

    it('should return current year', (): void => {
        expect(Sftoomi.getCurrentYear()).toBe(new Date().getFullYear());
    });

    describe('Type checking', (): void => {
        it('should correctly identify arrays', (): void => {
            expect(Sftoomi.isArray([1, 2, 3])).toBe(true);
            expect(Sftoomi.isArray({})).toBe(false);
            expect(Sftoomi.isArray(null)).toBe(false);
        });

        it('should correctly identify dates', (): void => {
            expect(Sftoomi.isDate(new Date())).toBe(true);
            expect(Sftoomi.isDate('2026-05-10')).toBe(false);
            expect(Sftoomi.isDate(null)).toBe(false);
        });

        it('should correctly identify plain objects', (): void => {
            expect(Sftoomi.isObject({ a: 1 })).toBe(true);
            expect(Sftoomi.isObject([])).toBe(false);
            expect(Sftoomi.isObject(null)).toBe(false);
        });

        it('should check if value is empty', (): void => {
            expect(Sftoomi.isEmpty(null)).toBe(true);
            expect(Sftoomi.isEmpty(undefined)).toBe(true);
            expect(Sftoomi.isEmpty([])).toBe(true);
            expect(Sftoomi.isEmpty('')).toBe(true);
            expect(Sftoomi.isEmpty('', true)).toBe(false); // allowBlank = true
            expect(Sftoomi.isEmpty('text')).toBe(false);
            expect(Sftoomi.isEmpty([1])).toBe(false);
        });
    });

    describe('Strings & Formatting', (): void => {
        it('should format string with arguments', (): void => {
            expect(Sftoomi.format('Our {0} project called {1}', ['angular', 'SFTOOMI'])).toBe('Our angular project called SFTOOMI');
        });

        it('should capitalize string correctly', (): void => {
            expect(Sftoomi.capitalizeString('hello world')).toBe('Hello world');
            expect(Sftoomi.capitalizeString('TEST')).toBe('Test');
            expect(Sftoomi.capitalizeString(123)).toBe('');
        });

        it('should format human short name', (): void => {
            expect(Sftoomi.humanShortName({
                last_name:   'Smith ',
                first_name:  'John',
                middle_name: 'Michael'
            })).toBe('Smith, J.M.');
            expect(Sftoomi.humanShortName('OnlyLastName')).toBe('OnlyLastName');
        });

        it('should format human full name', (): void => {
            expect(Sftoomi.humanFullName({
                last_name:   'Smith',
                first_name:  'John',
                middle_name: 'Michael'
            })).toBe('Smith, John Michael');
        });
    });

    describe('Date utilities', (): void => {
        it('should convert various formats to Date object', (): void => {
            expect(Sftoomi.toDate(null)).toBeNull();
            expect(Sftoomi.toDate(undefined)).toBeNull();

            const d = new Date();
            expect(Sftoomi.toDate(d)).toEqual(d);

            expect(Sftoomi.toDate(1710000000)).toBeInstanceOf(Date);
            expect(Sftoomi.toDate('2026-05-10T12:00:00.000Z')).toBeInstanceOf(Date);
            expect(Sftoomi.toDate('invalid-date')).toBeNull();
        });

        it('should compare two dates equality by day/month/year', (): void => {
            const d1 = new Date(2026, 4, 10, 10, 0),
                  d2 = new Date(2026, 4, 10, 18, 30),
                  d3 = new Date(2026, 4, 11, 10, 0);

            expect(Sftoomi.twoDatesEqual(d1, d2)).toBe(true);
            expect(Sftoomi.twoDatesEqual(d1, d3)).toBe(false);
        });
    });

    describe('Objects & Arrays helpers', (): void => {
        it('should remove array item by index', (): void => {
            const arr: string[] = ['a', 'b', 'c'];
            Sftoomi.removeArrayItemByIndex(arr, 1);
            expect(arr).toEqual(['a', 'c']);
        });

        it('should merge objects', (): void => {
            const obj1 = { a: 1, b: 2 },
                  obj2 = { b: 3, c: 4 };

            expect(Sftoomi.mergeObjects(obj1, obj2)).toEqual({ a: 1, b: 3, c: 4 });
        });

        it('should deeply duplicate entity', (): void => {
            const original = { a: { b: [1, 2] } },
                  clone = Sftoomi.duplicateEntity(original);

            expect(clone).toEqual(original);
            expect(clone).not.toBe(original);
            expect(clone.a).not.toBe(original.a);
        });
    });

    describe('Forms helpers', (): void => {
        it('should check if form field is required', (): void => {
            const form = new FormGroup({
                name:  new FormControl<string | null>(null, [Validators.required]),
                email: new FormControl<string | null>(null)
            });

            expect(Sftoomi.isFieldRequired(form, 'name')).toBe(true);
            expect(Sftoomi.isFieldRequired(form, 'email')).toBe(false);
        });

        it('should find form control name', (): void => {
            const ctrl = new FormControl('');
            new FormGroup({ myField: ctrl });

            expect(Sftoomi.getFormControlName(ctrl)).toBe('myField');
        });
    });

    describe('Application Mask state', (): void => {
        it('should manage global mask state properly', (): void => {
            expect(Sftoomi.isApplicationGlobalMaskShown()).toBe(false);

            Sftoomi.showApplicationGlobalMask();
            expect(Sftoomi.isApplicationGlobalMaskShown()).toBe(true);

            Sftoomi.hideApplicationGlobalMask();
            expect(Sftoomi.isApplicationGlobalMaskShown()).toBe(false);
        });
    });

    describe('Parsers & Execution helpers', (): void => {
        it('should parse gender correctly', (): void => {
            expect(Sftoomi.parseGender(1)).toBe(1);
            expect(Sftoomi.parseGender(0)).toBe(0);
            expect(Sftoomi.parseGender(null)).toBe(-1);
            expect(Sftoomi.parseGender(99)).toBe(-1);
        });

        it('should run method if exists', (): void => {
            const mockFn = vi.fn().mockReturnValue('success');
            expect(Sftoomi.runMethodIfExists(mockFn)).toBe('success');
            expect(mockFn).toHaveBeenCalledOnce();

            expect(Sftoomi.runMethodIfExists(undefined)).toBeUndefined();
        });
    });
});
