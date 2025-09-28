import { Component } from '@angular/core';

import AppTableImports from '../../../components/core/app-table/imports';

import Sftoomi from '../../../class/Sftoomi';

import AppTableComponent from '../../../components/core/app-table/app-table.component';
import ReferringDoctorsTableToolbarComponent from './toolbar/toolbar.component';

import getDoctorsAPI from '../../../APIs/getDoctorsAPI';

import AppTableColumn from '../../../type/AppTableColumn';

@Component({
    selector: 'referring-doctors-table',
    templateUrl: '../../../components/core/app-table/app-table.component.html',
    styleUrl: '../../../components/core/app-table/app-table.component.scss',
    imports: [ AppTableImports ]
})

export default class ReferringDoctorsTableComponent extends AppTableComponent
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
        name: 'doctor_facilities',
        header: {
            caption: Sftoomi.Translator.translate('views.referring_doctors.table.columns.facilities.caption'),
            tooltipRenderer: (): string => Sftoomi.Translator.translate('views.referring_doctors.table.columns.facilities.tooltip')
        },
        rawHtml: true,
        valueRenderer: (facilities: getDoctorsAPI['data'][0]['doctor_facilities']): string => {
            if (Sftoomi.isEmpty(facilities)) {
                return Sftoomi.Translator.translate('not_set');
            }

            let lines: string[] = [];
            facilities.forEach(facility => {
                lines.push(
                    '<ul style="margin: unset">' +
                        '<li>' + facility.full_name + '</li>' +
                    '</ul>'
                );
            });

            return '<div>'+ lines.concat() +'</div>';
        }
    }];

    protected override readonly loadUrl: string = '/getDoctors';

    protected override readonly toolbar: any | undefined = ReferringDoctorsTableToolbarComponent;
}
