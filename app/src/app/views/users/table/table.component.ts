import { Component } from '@angular/core';

import AppTableImports from '../../../components/core/app-table/imports';

import Sftoomi from '../../../class/Sftoomi';

import AppTableComponent from '../../../components/core/app-table/app-table.component';
import UsersTableToolbarComponent from './toolbar/toolbar.component';
import LinksTablePermissionsColumnComponent from './columns/links/column.component'

import getUsersAPI from '../../../APIs/getUsersAPI';

import AppTableColumn from '../../../type/AppTableColumn';

@Component({
    selector: 'users-table',
    templateUrl: '../../../components/core/app-table/app-table.component.html',
    styleUrl: '../../../components/core/app-table/app-table.component.less',
    imports: [ AppTableImports ]
})

export default class UsersTableComponent extends AppTableComponent
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
        name: 'login',
        width: '200px',
        header: {
            caption: Sftoomi.Translator.translate('views.users.table.columns.login.caption')
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
        name: 'links',
        header: {
            caption: Sftoomi.Translator.translate('views.users.table.columns.links.caption')
        },
        customColumnComponent: LinksTablePermissionsColumnComponent
    }, {
        name: 'created_at',
        width: '200px',
        header: {
            caption: Sftoomi.Translator.translate('views.users.table.columns.created_at.caption')
        },
        valueRenderer: (value: getUsersAPI['data'][0]['created_at']): string => Sftoomi.dateTime(value)
    }];

    protected override readonly loadUrl: string = '/getUsers';
    protected override readonly removeUrl: string = '/removeUser';

    protected override readonly toolbar: any | undefined = UsersTableToolbarComponent;
}
