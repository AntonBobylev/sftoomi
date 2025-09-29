import { Component } from '@angular/core';

import StudiesTableComponent from './table/table.component';


@Component({
    selector: 'app-studies',
    templateUrl: './studies.component.html',
    imports: [
        StudiesTableComponent
    ],
    styleUrl: './studies.component.scss'
})
export default class StudiesComponent
{
}
