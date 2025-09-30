import { Component, Input } from '@angular/core';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { NzDividerComponent } from 'ng-zorro-antd/divider';

import Sftoomi from '../../../../class/Sftoomi';

import ExaminationsTableComponent from '../table.component';

@Component({
    selector: 'examinations-table-studies-column',
    templateUrl: './studies-column.component.html',
    styleUrl: './studies-column.component.scss',
    imports: [NzTooltipDirective, NzDividerComponent]
})

export default class ExaminationsTableStudiesColumnComponent
{
    @Input() public rowData: any = [];
    @Input() public table!: ExaminationsTableComponent;

    protected readonly Sftoomi = Sftoomi;
}
