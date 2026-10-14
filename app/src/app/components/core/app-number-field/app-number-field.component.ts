import { Component, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { MaskitoOptions } from '@maskito/core';

import AppTextFieldImports from '../app-text-field/imports';

import { createNumberMask } from './number-mask-generator';

import AppTextFieldComponent from '../app-text-field/app-text-field.component';

@Component({
    selector: 'app-number-field',
    templateUrl: '../app-text-field/app-text-field.component.html',
    imports: AppTextFieldImports,
    styleUrl: '../app-text-field/app-text-field.component.scss'
})
export default class AppNumberFieldComponent extends AppTextFieldComponent
{
    public readonly allowNegative:    InputSignal<boolean> = input<boolean>(false);
    public readonly maxDecimalDigits: InputSignal<number>  = input<number>(0);

    protected override readonly mask: WritableSignal<MaskitoOptions | null> = signal<MaskitoOptions | null>(
        createNumberMask({
            allowNegative:    this.allowNegative(),
            maxDecimalDigits: this.maxDecimalDigits()
        })
    );
}
