import { Component } from '@angular/core';

import AppBaseModule from '../../components/core/app-base-module'

import UsersTableComponent from './table/table.component';

@Component({
    selector: 'app-users-module',
    templateUrl: './users.component.html',
    imports: [
        UsersTableComponent
    ],
    styleUrl: './users.component.less'
})

export default class UsersModuleComponent extends AppBaseModule
{
}
