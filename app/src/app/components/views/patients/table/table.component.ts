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
    protected override readonly url: string = '/getPatients';
    protected override readonly toolbar: any = PatientsTableToolbarComponent;
    protected override readonly paginatorRequired: boolean = true;

    protected override readonly columns: AppTableColumn[] = [{
        name: 'id',
        caption: Sftoomi.Translator.translate('id'),
        headerStyles: {
            alignment: 'center'
        },
        styles: {
            width: '50px',
            alignment: 'center'
        }
    }, {
        name: 'dob',
        caption: Sftoomi.Translator.translate('dob_full'),
        valueRenderer: function (value: any): string
        {
            return Sftoomi.dateShort(value) ?? 'undefined';
        },
        headerStyles: {
            alignment: 'center'
        },
        styles: {
            width: Sftoomi.Translator.translate('views.patients.table.columns.dob.width'),
            alignment: 'center'
        }
    }, {
        name: 'last_name',
        caption: Sftoomi.Translator.translate('last_name'),
    }, {
        name: 'first_name',
        caption: Sftoomi.Translator.translate('first_name')
    }, {
        name: 'middle_name',
        caption: Sftoomi.Translator.translate('middle_name')
    }, {
        name: 'phone',
        caption: Sftoomi.Translator.translate('phone'),
        resizable: true,
        styles: {
            width: '140px',
            alignment: 'center'
        },
        headerStyles: {
            alignment: 'center'
        }
    }];
}
