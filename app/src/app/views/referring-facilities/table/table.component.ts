import { Component } from '@angular/core';

import AppTableImports from '../../../components/core/app-table/imports';

import Sftoomi from '../../../class/Sftoomi';

import AppTableComponent from '../../../components/core/app-table/app-table.component';
import ReferringFacilitiesTableToolbarComponent from './toolbar/toolbar.component';

import AppTableColumn from '../../../type/AppTableColumn';

@Component({
    selector: 'referring-facilities-table',
    templateUrl: '../../../components/core/app-table/app-table.component.html',
    styleUrl: '../../../components/core/app-table/app-table.component.scss',
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
        header: {
            caption: Sftoomi.Translator.translate('full_name')
        }
    }];

    protected override readonly loadUrl: string = '/getFacilities';

    protected override readonly toolbar: any | undefined = ReferringFacilitiesTableToolbarComponent;
}
