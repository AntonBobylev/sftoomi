import { Component } from '@angular/core';
import StudiesTableComponent from './table/table.component';

@Component({
    selector: 'studies-module',
    imports: [
        StudiesTableComponent
    ],
    templateUrl: './studies.component.html',
    styleUrl: './studies.component.scss'
})

export default class StudiesComponent
{
}
