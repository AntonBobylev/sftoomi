import { Component, Input, signal, WritableSignal } from '@angular/core';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import AppBaseField from '../../../core/app-base-field';

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
    @Input({required: true}) public store: WritableSignal<AppComboRecord[]> = signal([]);

    @Input() public override label: string = 'Study';
}
