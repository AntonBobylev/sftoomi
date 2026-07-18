import { Component } from '@angular/core';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';

import ExaminationsTableComponent, { ExaminationsTableRow } from '../table.component';
import AppTableCommonColumn from '../../../../components/core/app-table/common-column.component'

@Component({
    selector: 'examinations-table-patient-column',
    templateUrl: './patient-column.component.html',
    styleUrl: './patient-column.component.less',
    imports: [ NzTooltipDirective ]
})

export default class ExaminationsTablePatientColumnComponent extends AppTableCommonColumn<ExaminationsTableRow, ExaminationsTableComponent>
{
}
