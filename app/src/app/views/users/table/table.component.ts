import { Component } from '@angular/core';

import AppTableImports from '../../../components/core/app-table/imports';

import Sftoomi from '../../../class/Sftoomi';

import AppTableComponent from '../../../components/core/app-table/app-table.component';
import UsersTableToolbarComponent from './toolbar/toolbar.component';

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
        name: 'roles',
        width: '200px',
        header: {
            caption: Sftoomi.Translator.translate('views.users.table.columns.roles.caption')
        },
        rawHtml: true,
        valueRenderer: (value: getUsersAPI['data'][0]['roles']): string => {
            let roles = JSON.parse(value);
            if (Sftoomi.isEmpty(roles)) {
                return Sftoomi.Translator.translate('not_set_tip');
            }

            let prettyFormattedRoles: string = '';
            roles.forEach((role: string): void => {
                prettyFormattedRoles += '<li>' + role + '</li>';
            });

            return '<ul style="margin: 0">' + prettyFormattedRoles + '</ul>';
        }
    }, {
        name: 'created_at',
        header: {
            caption: Sftoomi.Translator.translate('views.users.table.columns.created_at.caption')
        },
        valueRenderer: (value: getUsersAPI['data'][0]['created_at']): string => Sftoomi.dateTime(value)
    }];

    protected override readonly loadUrl: string = '/getUsers';

    protected override readonly toolbar: any | undefined = UsersTableToolbarComponent;
}
