import { Component } from '@angular/core';

import AppTableImports from '../../../components/core/app-table/imports';

import Sftoomi from '../../../class/Sftoomi';

import AppTableComponent from '../../../components/core/app-table/app-table.component';
import ReferringFacilitiesTableToolbarComponent from './toolbar/toolbar.component';

import getFacilitiesAPI from '../../../APIs/getFacilitiesAPI';

import AppTableColumn from '../../../type/AppTableColumn';

@Component({
    selector: 'referring-facilities-table',
    templateUrl: '../../../components/core/app-table/app-table.component.html',
    styleUrl: '../../../components/core/app-table/app-table.component.less',
    imports: [ AppTableImports ]
})

export default class ReferringFacilitiesTableComponent extends AppTableComponent
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
        name: 'short_name',
        width: '200px',
        header: {
            caption: Sftoomi.Translator.translate('short_name')
        }
    }, {
        name: 'full_name',
        width: '400px',
        header: {
            caption: Sftoomi.Translator.translate('full_name')
        }
    }, {
        name: 'facility_doctors',
        header: {
            caption: Sftoomi.Translator.translate('views.referring_facilities.table.columns.doctors.caption'),
            tooltipRenderer: (): string => Sftoomi.Translator.translate('views.referring_facilities.table.columns.doctors.tooltip')
        },
        rawHtml: true,
        valueRenderer: (doctors: getFacilitiesAPI['data'][0]['facility_doctors']): string => {
            if (Sftoomi.isEmpty(doctors)) {
                return Sftoomi.Translator.translate('not_set_tip');
            }

            let lines: string[] = [];
            doctors.forEach(doctor => {
                lines.push(
                    '<ul style="margin: unset">' +
                        '<li>' + Sftoomi.humanFullName(doctor) + '</li>' +
                    '</ul>'
                );
            });

            return `<div>${lines.join('')}</div>`;
        }
    }];

    protected override readonly loadUrl: string = '/getFacilities';
    protected override readonly removeUrl: string = '/removeFacility';

    protected override readonly toolbar: any | undefined = ReferringFacilitiesTableToolbarComponent;
}
