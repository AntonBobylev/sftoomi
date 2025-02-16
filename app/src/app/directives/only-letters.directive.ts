import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[onlyLetters]',
})
export class OnlyLettersDirective
{
    @HostListener('input', ['$event'])
    onInputChange(event: KeyboardEvent): void
    {
        const input = event.target as HTMLInputElement;
        input.value = input.value.replace(/[^a-zA-Z]*/g, '');
    }

    @HostListener('paste', ['$event'])
    onPaste(event: ClipboardEvent): void
    {
        event.preventDefault();

        const input = event.target as HTMLInputElement;
        input.value = '';
    }
}
