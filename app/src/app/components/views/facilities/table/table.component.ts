import { Component } from '@angular/core';

import Sftoomi from '../../../../class/Sftoomi';

import AppTableImports from '../../../core/app-table/app-table-imports';
import AppTableComponent from '../../../core/app-table/app-table.component';
import FacilitiesTableToolbarComponent from './toolbar/toolbar.component';

import AppTableColumn from '../../../../type/AppTableColumn';
import Doctor from '../../../../type/Doctor';

@Component({
    selector: 'facilities-table',
    templateUrl: '../../../core/app-table/app-table.component.html',
    styleUrl: '../../../core/app-table/app-table.component.scss',
    imports: [AppTableImports]
})

export default class FacilitiesTableComponent extends AppTableComponent
{
    protected override readonly url: string = '/getFacilities';
    protected override readonly toolbar = FacilitiesTableToolbarComponent;
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
        name: 'facility_doctors',
        caption: Sftoomi.Translator.translate('views.facilities.table.columns.doctors'),
        valueRenderer: function (doctors: Doctor[]): string
        {
            let result: string = '';
            doctors.forEach(function (doctor: Doctor): void {
                result += '<div>' + Sftoomi.humanShortName(doctor) + '</div>';
            });

            if (Sftoomi.isEmpty(result)) {
                result = Sftoomi.Translator.translate('not_set');
            }

            return result;
        },
        styles: {
            width: '300px',
            height: '40px'
        }
    }];
}
