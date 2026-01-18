import { Component } from '@angular/core';

import AppBaseModule from '../../components/core/app-base-module'

import GroupsTableComponent from './table/table.component'

@Component({
    selector: 'app-groups',
    imports: [
        GroupsTableComponent
    ],
    templateUrl: './groups.component.html',
    styleUrl: './groups.component.scss'
})

export default class GroupsComponent extends AppBaseModule
{
    protected override permission: string | null = 'GROUPS_MODULE';
}
