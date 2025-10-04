import { Component, Input } from '@angular/core';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';

import Sftoomi from '../../../../class/Sftoomi';

import ExaminationsTableComponent from '../table.component';

@Component({
    selector: 'examinations-table-referring-column',
    templateUrl: './referring-column.component.html',
    styleUrl: './referring-column.component.less',
    imports: [NzTooltipDirective]
})

export default class ExaminationsTableReferringColumnComponent
{
    @Input() public rowData: any = [];
    @Input() public table!: ExaminationsTableComponent;

    protected readonly Sftoomi = Sftoomi;
}
