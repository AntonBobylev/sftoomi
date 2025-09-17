import { Component } from '@angular/core';

import AppTableImports from '../../../core/app-table/app-table-imports';

import Sftoomi from '../../../../class/Sftoomi';

import AppTableComponent from '../../../core/app-table/app-table.component';
import TemplatesModuleTableToolbarComponent from './toolbar/toolbar.component';

import AppTableColumn from '../../../../type/AppTableColumn';

@Component({
    selector: 'templates-module-table',
    templateUrl: '../../../core/app-table/app-table.component.html',
    styleUrl: '../../../core/app-table/app-table.component.scss',
    imports: [AppTableImports]
})

export default class TemplatesModuleTableComponent extends AppTableComponent
{
    protected override readonly url: string = '/getTemplates';
    protected override readonly toolbar = TemplatesModuleTableToolbarComponent;
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
        name: 'name',
        caption: Sftoomi.Translator.translate('views.templates.table.columns.name')
    }];
}
