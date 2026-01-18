import { Component, Input } from '@angular/core';

import Sftoomi from '../../../../../class/Sftoomi';

import UsersTableComponent from '../../table.component'

import getUsersAPI from '../../../../../APIs/getUsersAPI'

@Component({
    selector: 'users-table-links-column',
    templateUrl: './column.component.html',
    styleUrl: './column.component.less',
    imports: []
})

export default class LinksTablePermissionsColumnComponent
{
    @Input() public rowData!: getUsersAPI['data'][0];
    @Input() public table!: UsersTableComponent;

    protected readonly Sftoomi = Sftoomi;
}
