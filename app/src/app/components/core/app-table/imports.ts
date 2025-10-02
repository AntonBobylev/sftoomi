import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { NgComponentOutlet } from '@angular/common';
import { NzTableComponent, NzTdAddOnComponent, NzThMeasureDirective, NzThSelectionComponent } from 'ng-zorro-antd/table';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';

import { SafePipe } from '../../../pipes/safe.pipe';

export default [
    NgStyle,
    NzTableComponent,
    NzThMeasureDirective,
    NzThSelectionComponent,
    NzTdAddOnComponent,
    NzTooltipDirective,
    SafePipe,
    NgComponentOutlet,
    NgTemplateOutlet,
    NzCheckboxComponent
]
