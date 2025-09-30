import { Component } from '@angular/core';

import AppTableImports from '../../../components/core/app-table/imports';

import Sftoomi from '../../../class/Sftoomi';

import AppTableComponent from '../../../components/core/app-table/app-table.component';

import AppTableColumn from '../../../type/AppTableColumn';

@Component({
    selector: 'examinations-table',
    templateUrl: '../../../components/core/app-table/app-table.component.html',
    styleUrl: '../../../components/core/app-table/app-table.component.scss',
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
        rawHtml: true,
        valueRenderer: (patient: any): string => {
            return `<div>
                        <div>${Sftoomi.humanShortName(patient)}</div>
                        <div>${Sftoomi.Translator.translate('dob_short')}: ${patient.dob ? Sftoomi.dateShort(patient.dob) : Sftoomi.Translator.translate('not_set_tip')}</div>
                        <div>${Sftoomi.Translator.translate('phone')}: ${patient.phone}</div>
                    </div>`;
        }
    }, {
        name: 'studies',
        header: {
            caption: Sftoomi.Translator.translate('views.examinations.table.columns.studies')
        }
    }];

    protected override readonly loadUrl: string = '/getExaminations';

    // protected override readonly toolbar: any | undefined = PatientsTableToolbarComponent;
}
