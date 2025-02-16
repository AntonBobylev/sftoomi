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

    @HostListener('input', ['$event.target'])
    protected onInput(input: HTMLInputElement): void
    {
        const caretPos: number | null = input.selectionStart;
        this.control.control?.setValue(input.value.toUpperCase());
        input.setSelectionRange(caretPos, caretPos);
    }

}
