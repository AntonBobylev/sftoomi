import { Component } from '@angular/core';

import AppTableImports from '../../../components/core/app-table/imports';

import Sftoomi from '../../../class/Sftoomi';

import AppTableComponent from '../../../components/core/app-table/app-table.component';

import getPatientsAPI from '../../../APIs/getPatientsAPI';

import AppTableColumn from '../../../type/AppTableColumn';

@Component({
    selector: 'patients-table',
    templateUrl: '../../../components/core/app-table/app-table.component.html',
    styleUrl: '../../../components/core/app-table/app-table.component.scss',
    imports: [ AppTableImports ]
})

export default class PatientsTableComponent extends AppTableComponent
{
    protected override readonly columns: AppTableColumn[] = [{
        name: 'id',
        header: {
            caption: Sftoomi.Translator.translate('id'),
            widthPx: '10', // TODO: doesn't work
            extraStyles: {
                justifyContent: 'center'
            }
        }
    }, {
        name: 'last_name',
        header: {
            caption: Sftoomi.Translator.translate('last_name')
        }
    }, {
        name: 'first_name',
        header: {
            caption: Sftoomi.Translator.translate('first_name')
        }
    }, {
        name: 'middle_name',
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
            caption: Sftoomi.Translator.translate('phone')
        }
    }];

    protected override readonly loadUrl: string = '/getPatients';
}
