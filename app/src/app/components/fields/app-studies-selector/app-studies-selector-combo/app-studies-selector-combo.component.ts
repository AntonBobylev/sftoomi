import { Component, input, Input, InputSignal, WritableSignal } from '@angular/core';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import AppBaseField from '../../../core/base/app-base-field';

import { AppComboRecord } from '../../../core/app-combo/app-combo.component';

@Component({
    selector: 'app-studies-selector-combo',
    templateUrl: './app-studies-selector-combo.component.html',
    imports: [
        NzSelectComponent, NzOptionComponent,
        FormsModule, ReactiveFormsModule
    ],
    styleUrl: './app-studies-selector-combo.component.less'
})
export default class AppStudiesSelectorComboComponent extends AppBaseField
{
    public readonly storeSignal: InputSignal<WritableSignal<AppComboRecord[]>> = input.required({ alias: 'store' });

    @Input() public override label: string = 'Study'; // TODO: translate
}
