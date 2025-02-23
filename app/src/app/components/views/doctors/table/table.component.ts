import { Component } from '@angular/core';

import Sftoomi from '../../../../class/Sftoomi';

import AppTableImports from '../../../core/app-table/app-table-imports';
import AppTableComponent from '../../../core/app-table/app-table.component';
import DoctorsTableToolbarComponent from './toolbar/toolbar.component';

import AppTableColumn from '../../../../type/AppTableColumn';

@Component({
    selector: 'doctors-table',
    templateUrl: '../../../core/app-table/app-table.component.html',
    styleUrl: '../../../core/app-table/app-table.component.scss',
    imports: [AppTableImports]
})

export default class DoctorsTableComponent extends AppTableComponent
{
    protected override readonly url: string = '/getDoctors';
    protected override readonly toolbar = DoctorsTableToolbarComponent;
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
        name: 'last_name',
        caption: Sftoomi.Translator.translate('last_name')
    }, {
        name: 'first_name',
        caption: Sftoomi.Translator.translate('first_name')
    }, {
        name: 'middle_name',
        caption: Sftoomi.Translator.translate('middle_name')
    }];
}
