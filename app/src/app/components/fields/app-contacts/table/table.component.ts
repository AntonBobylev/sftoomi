import { Component } from '@angular/core';

import AppTableImports from '../../../core/app-table/imports';

import Sftoomi from '../../../../class/Sftoomi';

import AppTableComponent from '../../../core/app-table/app-table.component';

import AppTableColumn from '../../../../type/AppTableColumn';

export type AppContactsTableRecord = {
    item_id:  number,
    type:     AppContactType,
    position: number,
    text:     string
};

export type AppContactType = 'email' | 'phone' | 'address';

@Component({
    selector: 'app-contacts-table',
    imports: [ AppTableImports ],
    templateUrl: '../../../core/app-table/app-table.component.html',
    styleUrl: '../../../core/app-table/app-table.component.less'
})
export default class AppContactsTableComponent extends AppTableComponent
{
    protected override readonly columns: AppTableColumn[] = [{
        name: 'position',
        width: '60px',
        header: {
            caption: Sftoomi.Translator.translate('fields.contacts.position'),
            extraStyles: {
                justifyContent: 'center'
            }
        },
        dataCell: {
            extraStyles: {
                justifyContent: 'center'
            }
        },
        valueRenderer: (value: AppContactsTableRecord['position']): string => Sftoomi.numberToOrdinal(value)
    }, {
        name: 'type',
        width: '120px',
        header: {
            caption: Sftoomi.Translator.translate('fields.contacts.type'),
        },
        valueRenderer: (type: AppContactsTableRecord['type']): string => {
            switch (type) {
                case 'email':
                    return Sftoomi.Translator.translate('fields.contacts.email');
                case 'phone':
                    return Sftoomi.Translator.translate('fields.contacts.phone');
                case 'address':
                    return Sftoomi.Translator.translate('fields.contacts.address');
                default:
                    return Sftoomi.Translator.translate('not_set_tip');
            }
        }
    }, {
        name: 'text',
        header: {
            caption: Sftoomi.Translator.translate('fields.contacts.text')
        }
    }];

    protected override usePagination: boolean = false;
}
