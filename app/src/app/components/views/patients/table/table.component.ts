import { Component } from '@angular/core';

import AppTableImports from '../../../core/app-table/app-table-imports';

import Sftoomi from '../../../../class/Sftoomi';

import AppTableComponent from '../../../core/app-table/app-table.component';
import PatientsTableToolbarComponent from './toolbar/toolbar.component';

import AppTableColumn from '../../../../type/AppTableColumn';

@Component({
    selector: 'patients-table',
    templateUrl: '../../../core/app-table/app-table.component.html',
    styleUrl: '../../../core/app-table/app-table.component.scss',
    imports: [AppTableImports]
})

export default class PatientsTableComponent extends AppTableComponent
{
    protected override readonly url: string = 'http://localhost:8080/getPatients';
    protected override readonly toolbar: any = PatientsTableToolbarComponent;

    protected override readonly columns: AppTableColumn[] = [{
        name: 'id',
        caption: 'ID',
        headerStyles: {
            alignment: 'center'
        },
        styles: {
            width: '50px',
            alignment: 'center'
        }
    }, {
        name: 'dob',
        caption: 'Date of birth',
        valueRenderer: function (value: any): string
        {
            return Sftoomi.dateShort(value.date) ?? 'undefined';
        },
        headerStyles: {
            alignment: 'center'
        },
        styles: {
            width: '120px',
            alignment: 'center'
        }
    }, {
        name: 'last_name',
        caption: 'Last name',
    }, {
        name: 'first_name',
        caption: 'First name'
    }, {
        name: 'middle_name',
        caption: 'Middle name'
    }];
}
