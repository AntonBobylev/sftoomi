import { Component } from '@angular/core';

import AppTableImports from '../../../core/app-table/app-table-imports';

import Sftoomi from '../../../../class/Sftoomi';

import AppTableComponent from '../../../core/app-table/app-table.component';
import StudiesTableToolbarComponent from './toolbar/toolbar.component';

import AppTableColumn from '../../../../type/AppTableColumn';
import Cpt from '../../../../type/Cpt';

@Component({
    selector: 'studies-table',
    templateUrl: '../../../core/app-table/app-table.component.html',
    styleUrl: '../../../core/app-table/app-table.component.scss',
    imports: [AppTableImports]
})

export default class StudiesTableComponent extends AppTableComponent
{
    protected override readonly url: string = '/getStudies';
    protected override readonly toolbar: any = StudiesTableToolbarComponent;
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
    }, {
        name: 'study_cpts',
        caption: Sftoomi.Translator.translate('views.studies.table.columns.study_cpts'),
        valueRenderer: function (records: Cpt[]): string
        {
            let result: string = '';
            records.forEach(function (record: Cpt): void {
                result += `<div><strong>${record.code}</strong> - ${record.short_name}</div>`;
            });

            return result;
        },
        styles: {
            height: '40px'
        }
    }];
}
