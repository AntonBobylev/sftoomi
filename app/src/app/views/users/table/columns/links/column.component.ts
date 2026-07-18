import { Component } from '@angular/core';

import UsersTableComponent from '../../table.component'
import AppTableCommonColumn from '../../../../../components/core/app-table/common-column.component'

import getUsersAPI from '../../../../../APIs/getUsersAPI'

@Component({
    selector: 'users-table-links-column',
    templateUrl: './column.component.html',
    styleUrl: './column.component.less'
})

export default class LinksTablePermissionsColumnComponent extends AppTableCommonColumn<getUsersAPI['data'][0], UsersTableComponent>
{
}
