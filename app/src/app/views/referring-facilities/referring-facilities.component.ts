import { Component } from '@angular/core';

import ReferringFacilitiesTableComponent from './table/table.component';

@Component({
    selector: 'app-referring-facilities',
    imports: [
        ReferringFacilitiesTableComponent
    ],
    templateUrl: './referring-facilities.component.html',
    styleUrl: './referring-facilities.component.scss'
})
export default class ReferringFacilitiesComponent
{
}
