import { Component } from '@angular/core';

import PatientsTableComponent from './table/table.component';

@Component({
    selector: 'app-patients',
    imports: [
        PatientsTableComponent
    ],
    templateUrl: './patients.component.html',
    styleUrl: './patients.component.scss'
})

export default class PatientsComponent
{
}
