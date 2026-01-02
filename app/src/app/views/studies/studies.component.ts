import { Component } from '@angular/core';

import AppBaseModule from '../../components/core/app-base-module'

import StudiesTableComponent from './table/table.component';

@Component({
    selector: 'app-studies-module',
    templateUrl: './studies.component.html',
    imports: [
        StudiesTableComponent
    ],
    styleUrl: './studies.component.scss'
})
export default class StudiesModuleComponent extends AppBaseModule
{
}
