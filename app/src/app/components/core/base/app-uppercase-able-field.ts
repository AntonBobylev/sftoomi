import { Directive, input, InputSignal } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import AppBaseField from './app-base-field';

@Directive()
export default abstract class AppUppercaseAbleField extends AppBaseField
{
    public readonly useUppercase: InputSignal<boolean> = input(false);

    protected onInput(event: any): void
    {
        const control: AbstractControl | null = this.getControl();
        if (control) {
            const value = control.value;

            if (!this.Sftoomi.isEmpty(value) && value && this.useUppercase()) {
                control.setValue(value.toUpperCase());
            }
        }

        this.changeEvent.emit(event.data);
    }
}
