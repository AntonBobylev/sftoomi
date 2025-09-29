import { Component } from '@angular/core';

import AppTableImports from '../../../components/core/app-table/imports';

import Sftoomi from '../../../class/Sftoomi';

import AppTableComponent from '../../../components/core/app-table/app-table.component';
import StudiesTableToolbarComponent from './toolbar/toolbar.component';

import getStudiesAPI from '../../../APIs/getStudiesAPI';

import AppTableColumn from '../../../type/AppTableColumn';

@Component({
    selector: 'studies-table',
    templateUrl: '../../../components/core/app-table/app-table.component.html',
    styleUrl: '../../../components/core/app-table/app-table.component.scss',
    imports: [ AppTableImports ]
})

export default class StudiesTableComponent extends AppTableComponent
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
        },
        dataCell: {
            tooltipRenderer: (row: getStudiesAPI['data'][0]): string => row.short_name
        }
    }, {
        name: 'full_name',
        width: '400px',
        header: {
            caption: Sftoomi.Translator.translate('full_name')
        }
    }, {
        name: 'study_cpts',
        header: {
            caption: Sftoomi.Translator.translate('views.studies.table.columns.cpts.caption'),
            tooltipRenderer: (): string => Sftoomi.Translator.translate('views.studies.table.columns.cpts.tooltip')
        },
        rawHtml: true,
        valueRenderer: (cpts: getStudiesAPI['data'][0]['study_cpts']): string => {
            if (Sftoomi.isEmpty(cpts)) {
                return Sftoomi.Translator.translate('not_set');
            }

            let lines: string[] = [];
            cpts.forEach(cpt => {
                lines.push(
                    '<ul style="margin: unset">' +
                        '<li>' + cpt.code + ' (' + cpt.short_name + ')' + '</li>' +
                    '</ul>'
                );
            });

            return `<div>${lines.join('')}</div>`;
        }
    }];

    protected override readonly loadUrl: string = '/getStudies';

    protected override readonly toolbar: any | undefined = StudiesTableToolbarComponent;
}
