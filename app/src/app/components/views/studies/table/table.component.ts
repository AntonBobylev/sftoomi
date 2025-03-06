import { Component } from '@angular/core';

import AppTableImports from '../../../core/app-table/app-table-imports';

import Sftoomi from '../../../../class/Sftoomi';

import AppTableComponent from '../../../core/app-table/app-table.component';
import StudiesTableToolbarComponent from './toolbar/toolbar.component';

import AppTableColumn from '../../../../type/AppTableColumn';

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
        valueRenderer: function (): string
        {
            return /*TODO:*/ 'Implement me';
        },
        styles: {
            width: '300px',
            height: '40px'
        }
    }];
}
