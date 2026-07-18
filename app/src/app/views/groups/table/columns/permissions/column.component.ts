import { Component } from '@angular/core';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';

import GroupsTableComponent from '../../table.component'
import AppTableCommonColumn from '../../../../../components/core/app-table/common-column.component'

import getGroupsAPI from '../../../../../APIs/getGroupsAPI'

@Component({
    selector: 'groups-table-permissions-column',
    templateUrl: './column.component.html',
    styleUrl: './column.component.less',
    imports: [ NzTooltipDirective ]
})

export default class GroupsTablePermissionsColumnComponent extends AppTableCommonColumn<getGroupsAPI['data'][0], GroupsTableComponent>
{
}
