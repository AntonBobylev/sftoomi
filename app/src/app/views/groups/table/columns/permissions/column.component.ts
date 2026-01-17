import { Component, Input } from '@angular/core';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';

import Sftoomi from '../../../../../class/Sftoomi';

import GroupsTableComponent from '../../table.component'
import getGroupsAPI from '../../../../../APIs/getGroupsAPI'

@Component({
    selector: 'groups-table-permissions-column',
    templateUrl: './column.component.html',
    styleUrl: './column.component.less',
    imports: [ NzTooltipDirective ]
})

export default class GroupsTablePermissionsColumnComponent
{
    @Input() public rowData!: getGroupsAPI['data'][0];
    @Input() public table!: GroupsTableComponent;

    protected readonly Sftoomi = Sftoomi;
}
