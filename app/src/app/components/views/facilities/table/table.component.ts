import { Component } from '@angular/core';

import Sftoomi from '../../../../class/Sftoomi';

import AppTableImports from '../../../core/app-table/app-table-imports';
import AppTableComponent from '../../../core/app-table/app-table.component';

import AppTableColumn from '../../../../type/AppTableColumn';

@Component({
    selector: 'facilities-table',
    templateUrl: '../../../core/app-table/app-table.component.html',
    styleUrl: '../../../core/app-table/app-table.component.scss',
    imports: [AppTableImports]
})

export default class FacilitiesTableComponent extends AppTableComponent
{
    protected override readonly url: string = '/getFacilities';
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
        name: 'short_name',
        caption: Sftoomi.Translator.translate('short_name')
    }, {
        name: 'full_name',
        caption: Sftoomi.Translator.translate('full_name')
    }];
}
