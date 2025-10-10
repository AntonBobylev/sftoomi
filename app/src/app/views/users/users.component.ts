import { Component } from '@angular/core';

import UsersTableComponent from './table/table.component';

@Component({
    selector: 'app-users-module',
    templateUrl: './users.component.html',
    imports: [
        UsersTableComponent
    ],
    styleUrl: './users.component.less'
})

export default class UsersModuleComponent
{
}
