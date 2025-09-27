import { Directive, Input } from '@angular/core';

import AppBaseField from './app-base-field';

@Directive()
export default abstract class AppUppercaseAbleField extends AppBaseField
{
    @Input() public useUppercase: boolean = false;

    protected onInput(event: any): void
    {
        if (!this.form.get(this.name)?.value) {
            this.onChange.emit(event.data);

            return;
        }

        if (this.useUppercase) {
            this.form.get(this.name)!.setValue((this.form.get(this.name)?.value).toUpperCase());
        }

        this.onChange.emit(event.data);
    }
}
