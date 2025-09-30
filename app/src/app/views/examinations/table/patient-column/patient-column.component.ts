import { Component, Input } from '@angular/core';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';

import Sftoomi from '../../../../class/Sftoomi';

import ExaminationsTableComponent from '../table.component';

@Component({
    selector: 'examinations-table-patient-column',
    templateUrl: './patient-column.component.html',
    imports: [ NzTooltipDirective ]
})

export default class ExaminationsTablePatientColumnComponent
{
    @Input() public rowData: any = [];
    @Input() public table!: ExaminationsTableComponent;

    protected readonly Sftoomi = Sftoomi;
}
