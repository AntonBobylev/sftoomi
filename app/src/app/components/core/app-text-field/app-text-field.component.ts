import { Component, input, InputSignal } from '@angular/core';
import { MaskitoOptions } from '@maskito/core';

import AppTextFieldImports from './imports';

import AppUppercaseAbleField from '../base/app-uppercase-able-field';

@Component({
    selector: 'app-text-field',
    templateUrl: './app-text-field.component.html',
    imports: AppTextFieldImports,
    styleUrl: './app-text-field.component.scss'
})

export default class AppTextFieldComponent extends AppUppercaseAbleField
{
    public readonly securedInput: InputSignal<boolean>               = input<boolean>(false);
    public readonly mask:         InputSignal<MaskitoOptions | null> = input<MaskitoOptions | null>(null);
}
