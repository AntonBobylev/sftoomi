import { Component } from '@angular/core';

import AppTableImports from '../../../components/core/app-table/imports';
import Sftoomi from '../../../class/Sftoomi';

import AppTableComponent from '../../../components/core/app-table/app-table.component';
import ReportTemplatesTableToolbarComponent from './toolbar/toolbar.component';

import AppTableColumn from '../../../type/AppTableColumn';

@Component({
    selector: 'report-templates-table',
    templateUrl: '../../../components/core/app-table/app-table.component.html',
    styleUrl: '../../../components/core/app-table/app-table.component.less',
    imports: [ AppTableImports ]
})

export default class ReportTemplatesTableComponent extends AppTableComponent
{
    protected override readonly columns: AppTableColumn[] = [{
        name: 'id',
        width: '60px',
        header: {
            caption: Sftoomi.Translator.translate('id'),
            extraStyles: {
                justifyContent: 'center'
            }
        },
        dataCell: {
            extraStyles: {
                justifyContent: 'center'
            }
        }
    }, {
        name: 'name',
        header: {
            caption: Sftoomi.Translator.translate('views.report_templates.table.columns.name.caption')
        }
    }];

    protected override readonly loadUrl: string = '/getTemplates';
    protected override readonly removeUrl: string = '/removeTemplate';

    protected override readonly toolbar: any | undefined = ReportTemplatesTableToolbarComponent;
}
