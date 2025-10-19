import { Component, Input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common'
import { NzIconDirective } from 'ng-zorro-antd/icon'
import { NzButtonComponent } from 'ng-zorro-antd/button'

import Sftoomi from '../../../../../class/Sftoomi'

import AppContactsTableComponent, { AppContactsTableRecord } from '../table.component'

@Component({
    selector: 'app-contacts-table-position-mover-column',
    templateUrl: './position-mover-column.component.html',
    styleUrl: './position-mover-column.component.less',
    imports: [NzButtonComponent, NzIconDirective, NgTemplateOutlet]
})

export default class AppContactsTablePositionMoverColumnComponent
{
    @Input() public rowData: AppContactsTableRecord[] = [];
    @Input() public table!: AppContactsTableComponent;

    protected readonly Sftoomi = Sftoomi

    protected move(direction: 'up' | 'down'): void
    {
        // TODO: implement
    }

    protected isMovingButtonDisabled(direction: 'up' | 'down'): boolean
    {
        // TODO: implement

        return false;
    }
}
