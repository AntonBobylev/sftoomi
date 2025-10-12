import { Component } from '@angular/core';

import AppTableImports from '../../../core/app-table/imports';

import Sftoomi from '../../../../class/Sftoomi';

import AppTableComponent from '../../../core/app-table/app-table.component';

import AppTableColumn from '../../../../type/AppTableColumn';

@Component({
    selector: 'app-contacts-table',
    imports: [ AppTableImports ],
    templateUrl: '../../../core/app-table/app-table.component.html',
    styleUrl: '../../../core/app-table/app-table.component.less'
})
export default class AppContactsTableComponent extends AppTableComponent
{
    protected override readonly columns: AppTableColumn[] = [{
        name: 'type',
        width: '60px',
        header: {
            caption: Sftoomi.Translator.translate('fields.contacts.type'),
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
        name: 'position',
        width: '60px',
        header: {
            caption: Sftoomi.Translator.translate('fields.contacts.position')
        }
    }, {
        name: 'text',
        header: {
            caption: Sftoomi.Translator.translate('fields.contacts.text')
        }
    }];

    protected override usePagination: boolean = false;
}
