import { Component } from '@angular/core';

import ReferringDoctorsTableComponent from './table/table.component';

@Component({
    selector: 'app-referring-doctors',
    imports: [
        ReferringDoctorsTableComponent
    ],
    templateUrl: './referring-doctors.component.html',
    styleUrl: './referring-doctors.component.scss'
})
export default class ReferringDoctorsComponent
{
}
