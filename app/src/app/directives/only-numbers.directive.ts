import { Directive, ElementRef, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
    selector: 'input[onlyNumbers]',
})
export default class OnlyNumbersDirective implements OnChanges
{
    @Input() onlyNumbers: boolean = true;
    @Input() allowDecimals: boolean = false;
    @Input() maxDecimalDigits: number | null = null;
    @Input() allowNegative: boolean = false;
    @Input() maxLength: number | null = null;

    private readonly decimalSeparator: string = '.';
    private isProgrammaticChange: boolean = false;

    private readonly specialKeys: string[] = [
        'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
        'ArrowLeft', 'ArrowRight', 'Home', 'End'
    ];

    constructor(private el: ElementRef)
    {
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void
    {
        if (!this.onlyNumbers) {
            return;
        }

        const currentValue: string = this.el.nativeElement.value;
        const position: any = this.el.nativeElement.selectionStart;
        const next: string = this.getNextValue(currentValue, event.key, position);

        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }

        if (event.ctrlKey && ['a', 'c', 'v', 'x'].includes(event.key)) {
            return;
        }

        if (!this.isValidInput(event.key, position, currentValue)) {
            event.preventDefault();
        }

        if (this.maxLength && next.length > this.maxLength) {
            event.preventDefault();
        }

        if (this.allowDecimals && this.maxDecimalDigits !== null && /^\d$/.test(event.key)) {
            const decimalParts: string[] = currentValue.split('.');
            if (decimalParts.length === 2 && decimalParts[1].length >= this.maxDecimalDigits) {
                const selectionStart: any = this.el.nativeElement.selectionStart,
                    selectionEnd:     any = this.el.nativeElement.selectionEnd;

                if (selectionStart === selectionEnd &&
                    selectionStart > currentValue.indexOf('.') &&
                    decimalParts[1].length >= this.maxDecimalDigits) {
                    event.preventDefault();
                }
            }
        }
    }

    @HostListener('paste', ['$event'])
    onPaste(event: ClipboardEvent): void
    {
        if (!this.onlyNumbers) {
            return;
        }

        event.preventDefault();
        const clipboardData: DataTransfer | null = event.clipboardData;
        const pastedText: string | undefined = clipboardData?.getData('text');

        if (!pastedText) {
            return;
        }

        const cleanedText: string = this.cleanInputValue(pastedText);
        if (cleanedText === '') {
            return;
        }

        const input:        any = this.el.nativeElement,
            currentValue:   any = input.value,
            selectionStart: any = input.selectionStart,
            selectionEnd:   any = input.selectionEnd;

        const newValue: string = currentValue.substring(0, selectionStart) +
            cleanedText +
            currentValue.substring(selectionEnd);

        const finalValue: string = this.cleanInputValue(newValue);

        if (this.isValidFinalValue(finalValue)) {
            this.setInputValue(finalValue);
        }
    }

    @HostListener('input', ['$event'])
    onInput(event: Event): void
    {
        if (!this.onlyNumbers) {
            return;
        }

        if (this.isProgrammaticChange) {
            this.isProgrammaticChange = false;
            return;
        }

        const input = event.target as HTMLInputElement,
            value: string = input.value;

        if (value === '') {
            return;
        }

        const cleanedValue: string = this.cleanInputValue(value);

        if (this.allowDecimals && this.isIntermediateDecimalValue(cleanedValue)) {
            return;
        }

        let finalValue: string = cleanedValue;
        if (this.allowDecimals && this.maxDecimalDigits !== null) {
            finalValue = this.trimDecimalDigits(cleanedValue);
        }

        if (!this.isValidFinalValue(finalValue) || value !== finalValue) {
            this.setInputValue(finalValue);
        }
    }

    @HostListener('blur')
    onBlur(): void
    {
        if (!this.onlyNumbers) {
            return;
        }

        const input: any = this.el.nativeElement,
              value: any = input.value;

        if (value === '.' || value === '-.') {
            this.setInputValue('');
        } else if (value.endsWith('.') && value.length > 1) {
            this.setInputValue(value.slice(0, -1));
        }
    }

    private getNextValue(current: string, newChar: string, position: number): string
    {
        return current.substring(0, position) + newChar + current.substring(position);
    }

    private isValidInput(newChar: string, position: number, currentValue: string): boolean
    {
        if (/^\d$/.test(newChar)) {
            if (this.allowDecimals && this.maxDecimalDigits !== null) {
                const decimalIndex = currentValue.indexOf('.');
                if (decimalIndex !== -1 && position > decimalIndex) {
                    const decimalPart = currentValue.substring(decimalIndex + 1);
                    if (decimalPart.length >= this.maxDecimalDigits) {
                        return false;
                    }
                }
            }

            return true;
        }

        if (this.allowDecimals && newChar === this.decimalSeparator) {
            const hasDecimal: boolean = currentValue.includes(this.decimalSeparator),
                isAtValidPosition: boolean = position > (this.allowNegative && currentValue.startsWith('-') ? 1 : 0);

            return !hasDecimal && isAtValidPosition;
        }

        if (this.allowNegative && newChar === '-') {
            return position === 0 && !currentValue.includes('-');
        }

        return false;
    }

    private cleanInputValue(value: string): string
    {
        let result: string = '',
            hasDecimal: boolean = false,
            hasMinus: boolean = false;

        for (let i: number = 0; i < value.length; i++) {
            const char: string = value[i];

            if (this.allowNegative && char === '-' && !hasMinus && result === '') {
                result += char;
                hasMinus = true;
                continue;
            }

            if (/^\d$/.test(char)) {
                result += char;
                continue;
            }

            if (this.allowDecimals && char === this.decimalSeparator && !hasDecimal) {
                if (result === '' || (result === '-' && this.allowNegative)) {
                    continue;
                }
                result += char;
                hasDecimal = true;
            }
        }

        return result;
    }

    private trimDecimalDigits(value: string): string
    {
        if (!this.allowDecimals || this.maxDecimalDigits === null) {
            return value;
        }

        const decimalParts = value.split('.');
        if (decimalParts.length === 2 && decimalParts[1].length > this.maxDecimalDigits) {
            return decimalParts[0] + '.' + decimalParts[1].substring(0, this.maxDecimalDigits);
        }

        return value;
    }

    private isValidFinalValue(value: string): boolean
    {
        if (value === '' || value === '-') return true;

        const numberRegex = this.allowNegative ?
            (this.allowDecimals ? /^-?\d*\.?\d*$/ : /^-?\d+$/) :
            (this.allowDecimals ? /^\d*\.?\d*$/ : /^\d+$/);

        if (!numberRegex.test(value)) {
            return false;
        }

        if (this.allowDecimals && this.maxDecimalDigits !== null) {
            const decimalParts = value.split('.');
            if (decimalParts.length === 2 && decimalParts[1].length > this.maxDecimalDigits) {
                return false;
            }
        }

        if (this.maxLength !== null && value.length > this.maxLength) {
            return false;
        }

        // noinspection RedundantIfStatementJS
        if (value === '.' || value === '-.') {
            return false;
        }

        return true;
    }

    private isIntermediateDecimalValue(value: string): boolean
    {
        if (!this.allowDecimals) {
            return false;
        }

        if (value.endsWith('.') && value.length > 1 && !value.endsWith('-.')) {
            const withoutDecimal: string = value.slice(0, -1);

            return /^-?\d+$/.test(withoutDecimal);
        }

        return false;
    }

    private setInputValue(value: string): void
    {
        this.isProgrammaticChange = true;
        this.el.nativeElement.value = value;

        setTimeout((): void => {
            this.isProgrammaticChange = false;
        });

        this.el.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
    }

    ngOnChanges(_changes: SimpleChanges): void
    {
        if (!this.onlyNumbers) {
            return;
        }

        if (this.el.nativeElement.value) {
            const currentValue: any = this.el.nativeElement.value,
                cleanedValue: string = this.cleanInputValue(currentValue);

            let finalValue: string = cleanedValue;
            if (this.allowDecimals && this.maxDecimalDigits !== null) {
                finalValue = this.trimDecimalDigits(cleanedValue);
            }

            if (!this.isValidFinalValue(finalValue) || currentValue !== finalValue) {
                this.setInputValue(finalValue);
            }
        }
    }
}
