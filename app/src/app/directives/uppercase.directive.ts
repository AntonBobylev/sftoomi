import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[uppercase]'
})
export default class UppercaseDirective
{
    constructor(private readonly control: NgControl)
    {
    }

    @HostListener('input', ['$event'])
    protected onInput(event: Event): void
    {
        const input = event.target as HTMLInputElement;
        if (!input) {
            return;
        }

        const caretPos: number | null = input.selectionStart;
        this.control.control?.setValue(input.value.toUpperCase());
        input.setSelectionRange(caretPos, caretPos);
    }
}
