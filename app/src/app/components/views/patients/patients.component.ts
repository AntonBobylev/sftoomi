import { Component } from '@angular/core';

import PatientsTableComponent from './table/table.component';

@Component({
    selector: 'patients-module',
    imports: [PatientsTableComponent],
    templateUrl: './patients.component.html',
    styleUrl: './patients.component.scss'
})

export default class PatientsComponent
{
}
