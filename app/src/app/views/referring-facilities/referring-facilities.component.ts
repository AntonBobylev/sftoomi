import { Component } from '@angular/core';

import AppBaseModule from '../../components/core/app-base-module'

import ReferringFacilitiesTableComponent from './table/table.component';

@Component({
    selector: 'app-referring-facilities',
    imports: [
        ReferringFacilitiesTableComponent
    ],
    templateUrl: './referring-facilities.component.html',
    styleUrl: './referring-facilities.component.scss'
})
export default class ReferringFacilitiesComponent extends AppBaseModule
{
    protected override permission: string | null = 'REFERRING_FACILITIES_MODULE';
}
