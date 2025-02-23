import { Component } from '@angular/core';

import FacilitiesTableComponent from './table/table.component';

@Component({
    selector: 'facilities-module',
    templateUrl: './facilities.component.html',
    imports: [FacilitiesTableComponent],
    styleUrl: './facilities.component.scss'
})

export default class FacilitiesComponent
{
}
