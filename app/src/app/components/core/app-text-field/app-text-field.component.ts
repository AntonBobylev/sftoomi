import { Component, effect, input, InputSignal, signal, WritableSignal } from '@angular/core';
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
    public readonly customMask:   InputSignal<MaskitoOptions | null> = input<MaskitoOptions | null>(null);

    protected readonly mask: WritableSignal<MaskitoOptions | null> = signal<MaskitoOptions | null>(null);

    constructor()
    {
        super();

        effect((): void => {
            const customMask: MaskitoOptions | null = this.customMask();
            if (!customMask) {
                return;
            }

            this.mask.set(customMask);
        });
    }

}
