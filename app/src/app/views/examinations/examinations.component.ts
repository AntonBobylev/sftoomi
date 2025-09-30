import { Component } from '@angular/core';

import ExaminationsTableComponent from './table/table.component';

@Component({
    selector: 'app-examinations',
    templateUrl: './examinations.component.html',
    imports: [
        ExaminationsTableComponent
    ],
    styleUrl: './examinations.component.scss'
})

export default class ExaminationsComponent
{

}
