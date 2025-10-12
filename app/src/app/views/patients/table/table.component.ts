import { Component } from '@angular/core';

import AppTableImports from '../../../components/core/app-table/imports';

import Sftoomi from '../../../class/Sftoomi';

import AppTableComponent from '../../../components/core/app-table/app-table.component';
import PatientsTableToolbarComponent from './toolbar/toolbar.component';

import getPatientsAPI from '../../../APIs/getPatientsAPI';

import AppTableColumn from '../../../type/AppTableColumn';

@Component({
    selector: 'patients-table',
    templateUrl: '../../../components/core/app-table/app-table.component.html',
    styleUrl: '../../../components/core/app-table/app-table.component.less',
    imports: [ AppTableImports ]
})

export default class PatientsTableComponent extends AppTableComponent
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
        name: 'last_name',
        width: '200px',
        header: {
            caption: Sftoomi.Translator.translate('last_name')
        }
    }, {
        name: 'first_name',
        width: '200px',
        header: {
            caption: Sftoomi.Translator.translate('first_name')
        }
    }, {
        name: 'middle_name',
        width: '200px',
        header: {
            caption: Sftoomi.Translator.translate('middle_name')
        }
    }, {
        name: 'dob',
        header: {
            caption: Sftoomi.Translator.translate('dob_full')
        },
        valueRenderer: (value: getPatientsAPI['data'][0]['dob']) => Sftoomi.dateShort(value)
    }, {
        name: 'phone',
        header: {
            caption: Sftoomi.Translator.translate('phone'),
            tooltipRenderer: (): string => Sftoomi.Translator.translate('views.patients.phone_column_header_tooltip')
        }
    }];

    protected override readonly loadUrl: string = '/getPatients';
    protected override readonly removeUrl: string = '/removePatient';

    protected override readonly toolbar: any | undefined = PatientsTableToolbarComponent;
}
