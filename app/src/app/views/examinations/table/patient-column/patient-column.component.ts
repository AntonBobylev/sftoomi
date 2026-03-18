import { Component, input, Input, InputSignal } from '@angular/core';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';

import Sftoomi from '../../../../class/Sftoomi';

import ExaminationsTableComponent, { ExaminationsTableRow } from '../table.component';

@Component({
    selector: 'examinations-table-patient-column',
    templateUrl: './patient-column.component.html',
    styleUrl: './patient-column.component.less',
    imports: [ NzTooltipDirective ]
})

export default class ExaminationsTablePatientColumnComponent
{
    public readonly rowData: InputSignal<ExaminationsTableRow>       = input.required();
    public readonly table:   InputSignal<ExaminationsTableComponent> = input.required();

    protected readonly Sftoomi: typeof Sftoomi = Sftoomi;
}
