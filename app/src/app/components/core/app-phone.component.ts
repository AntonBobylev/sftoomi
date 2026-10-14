import { Component, input, InputSignal } from '@angular/core';
import { MaskitoOptions } from '@maskito/core';

import AppTextFieldImports from './app-text-field/imports';

import phoneMask from '../../misc/phone-mask-generator';

import AppTextFieldComponent from './app-text-field/app-text-field.component';

@Component({
    selector: 'app-phone',
    templateUrl: './app-text-field/app-text-field.component.html',
    imports: AppTextFieldImports,
    styleUrl: './app-text-field/app-text-field.component.scss'
})

export default class AppPhoneComponent extends AppTextFieldComponent
{
    public override readonly mask: InputSignal<MaskitoOptions | null> = input<MaskitoOptions | null>(phoneMask);
}
