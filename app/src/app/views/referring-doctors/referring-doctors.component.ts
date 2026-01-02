import { Component } from '@angular/core';

import AppBaseModule from '../../components/core/app-base-module'

import ReferringDoctorsTableComponent from './table/table.component';

@Component({
    selector: 'app-referring-doctors',
    imports: [
        ReferringDoctorsTableComponent
    ],
    templateUrl: './referring-doctors.component.html',
    styleUrl: './referring-doctors.component.scss'
})
export default class ReferringDoctorsComponent extends AppBaseModule
{
}
