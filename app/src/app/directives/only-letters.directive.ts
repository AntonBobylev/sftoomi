import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[onlyLetters]',
})
export default class OnlyLettersDirective
{
    private readonly allowedKeys: string[] = [
        'Backspace',
        'ShiftLeft',
        'ControlLeft',
        'Tab',
        'Space',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Home',
        'End'
    ];

    @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent): void
    {
        if ((event.keyCode >= 65 && event.keyCode <= 90) || this.allowedKeys.includes(event.code)) {
            return;
        }

        event.preventDefault();
    }

    @HostListener('paste', ['$event'])
    onPaste(event: ClipboardEvent): void
    {
        event.preventDefault();

        const input = event.target as HTMLInputElement;
        input.value = '';
    }
}
