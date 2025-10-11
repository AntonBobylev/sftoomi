import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';

import AppBaseField from '../../core/app-base-field';

@Component({
    selector: 'app-checkbox',
    templateUrl: './app-checkbox.component.html',
    imports: [
        NzCheckboxComponent,
        ReactiveFormsModule,
        NzTooltipDirective
    ],
    styleUrl: './app-checkbox.component.less'
})

export default class AppCheckboxComponent extends AppBaseField
{
}
