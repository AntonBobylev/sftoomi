import { Component } from '@angular/core';

import AppTableImports from '../../../components/core/app-table/imports';

import Sftoomi from '../../../class/Sftoomi';

import AppTableComponent from '../../../components/core/app-table/app-table.component';
import ExaminationsTableToolbarComponent from './toolbar/toolbar.component';
import ExaminationsTablePatientColumnComponent from './patient-column/patient-column.component';
import ExaminationsTableStudiesColumnComponent from './studies-column/studies-column.component';
import ExaminationsTableReferringColumnComponent from './referring-column/referring-column.component';

import AppTableColumn from '../../../type/AppTableColumn';

@Component({
    selector: 'examinations-table',
    templateUrl: '../../../components/core/app-table/app-table.component.html',
    styleUrl: '../../../components/core/app-table/app-table.component.less',
    imports: [ AppTableImports ]
})

export default class ExaminationsTableComponent extends AppTableComponent
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
        name: 'patient',
        width: '200px',
        header: {
            caption: Sftoomi.Translator.translate('views.examinations.table.columns.patient')
        },
        customColumnComponent: ExaminationsTablePatientColumnComponent
    }, {
        name: 'referring',
        width: '200px',
        header: {
            caption: Sftoomi.Translator.translate('views.examinations.table.columns.referring.caption')
        },
        customColumnComponent: ExaminationsTableReferringColumnComponent
    }, {
        name: 'studies',
        header: {
            caption: Sftoomi.Translator.translate('views.examinations.table.columns.studies')
        },
        customColumnComponent: ExaminationsTableStudiesColumnComponent
    }];

    protected override readonly loadUrl: string = '/getExaminations';

    protected override readonly toolbar: any | undefined = ExaminationsTableToolbarComponent;
}
