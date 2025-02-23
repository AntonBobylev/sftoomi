import { Component } from '@angular/core';
import DoctorsTableComponent from './table/table.component';

@Component({
    selector: 'doctors-module',
    templateUrl: './doctors.component.html',
    imports: [
        DoctorsTableComponent
    ],
    styleUrl: './doctors.component.scss'
})

export default class DoctorsComponent
{
}
