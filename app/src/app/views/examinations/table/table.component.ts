import { Component } from '@angular/core';

import AppTableImports from '../../../components/core/app-table/imports';

import AppTableComponent from '../../../components/core/app-table/app-table.component';
import ExaminationsTableToolbarComponent from './toolbar/toolbar.component';
import ExaminationsTablePatientColumnComponent from './patient-column/patient-column.component';
import ExaminationsTableStudiesColumnComponent from './studies-column/studies-column.component';
import ExaminationsTableReferringColumnComponent from './referring-column/referring-column.component';

import AppTableColumn from '../../../type/AppTableColumn';

export type ExaminationsTableRowExam = {
    exam_id:            number,
    exam_drafts_exists: boolean
    study_id:           number,
    study_short_name:   string,
    study_full_name:    string
}

export type ExaminationsTableRow = {
    id:            number,
    patient: {
        id:          number,
        last_name:   string,
        first_name:  string,
        middle_name: string | null,
        dob:         string | null,
        phone:       string | null
    },
    doctor: {
        id:          number,
        last_name:   string,
        first_name:  string,
        middle_name: string | null
    },
    facility: {
        id:          number,
        short_name:  string,
        full_name:   string
    },
    studies: ExaminationsTableRowExam[]
}

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
            caption: this.Sftoomi.Translator.translate('id'),
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
            caption: this.Sftoomi.Translator.translate('views.examinations.table.columns.patient')
        },
        customColumnComponent: ExaminationsTablePatientColumnComponent
    }, {
        name: 'referring',
        width: '200px',
        header: {
            caption: this.Sftoomi.Translator.translate('views.examinations.table.columns.referring.caption')
        },
        customColumnComponent: ExaminationsTableReferringColumnComponent
    }, {
        name: 'studies',
        header: {
            caption: this.Sftoomi.Translator.translate('views.examinations.table.columns.studies.caption')
        },
        customColumnComponent: ExaminationsTableStudiesColumnComponent
    }];

    protected override readonly loadUrl: string = '/getExaminations';
    protected override readonly removeUrl: string = '/removeExamination';

    protected override readonly lazyLoad: boolean = true;

    protected override readonly toolbar: any | undefined = ExaminationsTableToolbarComponent;
}
