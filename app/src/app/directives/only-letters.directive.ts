import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[onlyLetters]',
})
export class OnlyLettersDirective
{
    protected key: number = 0;

    @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent): void
    {
        this.key = event.keyCode;
        if ((this.key >= 65 && this.key <= 90)) {
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
