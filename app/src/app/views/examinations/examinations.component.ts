import { Component } from '@angular/core';
import { NzLayoutComponent, NzSiderComponent } from 'ng-zorro-antd/layout'

import ExaminationsTableComponent from './table/table.component';
import { ExaminationsFiltersComponent } from './filters/filters.component';

@Component({
    selector: 'app-examinations',
    templateUrl: './examinations.component.html',
    imports: [
        ExaminationsTableComponent,
        ExaminationsFiltersComponent,
        NzLayoutComponent,
        NzSiderComponent
    ],
    styleUrl: './examinations.component.less'
})

export default class ExaminationsComponent
{
    protected isFiltersCollapsed: boolean = true;
}
