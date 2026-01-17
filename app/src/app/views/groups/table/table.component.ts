import { Component } from '@angular/core';

import AppTableImports from '../../../components/core/app-table/imports';

import Sftoomi from '../../../class/Sftoomi';

import AppTableComponent from '../../../components/core/app-table/app-table.component';
import GroupsTableToolbarComponent from './toolbar/toolbar.component'
import GroupsTablePermissionsColumnComponent from './columns/permissions/column.component'

import AppTableColumn from '../../../type/AppTableColumn';

@Component({
    selector: 'groups-table',
    templateUrl: '../../../components/core/app-table/app-table.component.html',
    styleUrl: '../../../components/core/app-table/app-table.component.less',
    imports: [ AppTableImports ]
})

export default class GroupsTableComponent extends AppTableComponent
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
        name: 'name',
        width: '200px',
        header: {
            caption: Sftoomi.Translator.translate('views.groups.table.columns.name.caption')
        }
    }, {
        name: 'permissions',
        width: '100%',
        header: {
            caption: Sftoomi.Translator.translate('views.groups.table.columns.permissions.caption')
        },
        customColumnComponent: GroupsTablePermissionsColumnComponent
    }];

    protected override readonly loadUrl: string = '/getGroups';
    protected override readonly removeUrl: string = '/removeGroup';

    protected override readonly toolbar: any | undefined = GroupsTableToolbarComponent;
}
