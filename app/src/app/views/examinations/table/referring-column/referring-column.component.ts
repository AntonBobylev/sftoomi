import { Component } from '@angular/core';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';

import ExaminationsTableComponent, { ExaminationsTableRow } from '../table.component';
import AppTableCommonColumn from '../../../../components/core/app-table/common-column.component'

@Component({
    selector: 'examinations-table-referring-column',
    templateUrl: './referring-column.component.html',
    styleUrl: './referring-column.component.less',
    imports: [NzTooltipDirective]
})

export default class ExaminationsTableReferringColumnComponent extends AppTableCommonColumn<ExaminationsTableRow, ExaminationsTableComponent>
{
}
