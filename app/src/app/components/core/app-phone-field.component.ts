import { Component, signal, WritableSignal } from '@angular/core';
import { MaskitoOptions } from '@maskito/core';

import AppTextFieldImports from './app-text-field/imports';

import phoneMask from '../../misc/phone-mask-generator';

import AppTextFieldComponent from './app-text-field/app-text-field.component';

@Component({
    selector: 'app-phone-field',
    templateUrl: './app-text-field/app-text-field.component.html',
    imports: AppTextFieldImports,
    styleUrl: './app-text-field/app-text-field.component.scss'
})

export default class AppPhoneFieldComponent extends AppTextFieldComponent
{
    protected override readonly mask: WritableSignal<MaskitoOptions | null> = signal<MaskitoOptions | null>(phoneMask);
}
