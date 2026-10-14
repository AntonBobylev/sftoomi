import { Component, input, InputSignal } from '@angular/core';

import AppNumberFieldImports from './imports';

import AppBaseField from '../base/app-base-field'

@Component({
    selector: 'app-number-field',
    templateUrl: './app-number-field.component.html',
    imports: AppNumberFieldImports,
    styleUrl: './app-number-field.component.less'
})

export default class AppNumberFieldComponent extends AppBaseField
{
    public readonly allowDecimals:    InputSignal<boolean>       = input(false);
    public readonly allowNegative:    InputSignal<boolean>       = input(false);
    public readonly maxDecimalDigits: InputSignal<number>        = input(2);
    public readonly maxLength:        InputSignal<number | null> = input<number | null>(null);
}
