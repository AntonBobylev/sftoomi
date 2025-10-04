import { Component } from '@angular/core';

import ExaminationsTableComponent from './table/table.component';
import { ExaminationsFiltersComponent } from './filters/filters.component';

@Component({
    selector: 'app-examinations',
    templateUrl: './examinations.component.html',
    imports: [
        ExaminationsTableComponent,
        ExaminationsFiltersComponent
    ],
    styleUrl: './examinations.component.scss'
})

export default class ExaminationsComponent
{

}
