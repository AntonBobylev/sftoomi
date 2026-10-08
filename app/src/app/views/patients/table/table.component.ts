import { Component, Type } from '@angular/core';

import AppTableImports from '../../../components/core/app-table/imports';

import Sftoomi from '../../../class/Sftoomi';

import AppTableComponent from '../../../components/core/app-table/app-table.component';
import PatientsTableToolbarComponent from './toolbar/toolbar.component';
import AppGenderColumnComponent from '../../../components/templates/gender/column.component';

import getPatientsAPI from '../../../APIs/getPatientsAPI';

import AppTableColumn from '../../../type/AppTableColumn';
import Gender from '../../../type/Gender';

type TableRow = {
    id:          number,
    last_name:   string,
    first_name:  string,
    middle_name: string,
    gender:      Gender,
    dob:         string | null,
    phone:       string | null
};

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
        name: 'gender',
        width: '120px',
        header: {
            caption: Sftoomi.Translator.translate('gender.caption')
        },
        customColumnComponent: AppGenderColumnComponent<TableRow, PatientsTableComponent>
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

    protected override readonly loadUrl:   string = '/getPatients';
    protected override readonly removeUrl: string = '/removePatient';

    protected override readonly toolbar: Type<PatientsTableToolbarComponent> = PatientsTableToolbarComponent;

    protected override afterSuccessfulLoad(result: getPatientsAPI): void
    {
        const data: TableRow[] = result.data.map(patient => ({
            id:          patient.id,
            last_name:   patient.last_name,
            first_name:  patient.first_name,
            middle_name: patient.middle_name,
            gender:      patient.gender,
            dob:         patient.dob,
            phone:       patient.phone
        }));

        super.afterSuccessfulLoad({
            data:  data,
            total: result.total
        });
    }
}
