import { Component, Input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common'
import { NzIconDirective } from 'ng-zorro-antd/icon'
import { NzButtonComponent } from 'ng-zorro-antd/button'
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip'

import Sftoomi from '../../../../../class/Sftoomi'

import AppContactsTableComponent, { AppContactsTableRecord } from '../table.component'

@Component({
    selector: 'app-contacts-table-position-mover-column',
    templateUrl: './position-mover-column.component.html',
    styleUrl: './position-mover-column.component.less',
    imports: [
        NzButtonComponent, NzIconDirective,
        NgTemplateOutlet, NzTooltipDirective
    ]
})

export default class AppContactsTablePositionMoverColumnComponent
{
    @Input() public rowData!: AppContactsTableRecord;
    @Input() public table!: AppContactsTableComponent;

    protected readonly Sftoomi = Sftoomi

    protected move(direction: 'up' | 'down'): void
    {
        let allRecords: AppContactsTableRecord[] = Sftoomi.duplicateEntity(this.table.getData()),
            maxPosition: number = this.getContactTypeMaxPosition();

        if (maxPosition < 1) {
            // something strange happened
            return;
        }

        let currentRecordIndex: number = allRecords.findIndex((record: AppContactsTableRecord): boolean => {
            return record.position == this.rowData.position;
        });

        if (currentRecordIndex < 0) {
            // something strange happened
            // the record wasn't found in table data
            return;
        }

        let nextPosition: number;
        if (direction === 'up') {
            nextPosition = allRecords[currentRecordIndex].position - 1;
            if (nextPosition < 0) {
                nextPosition = 0;
            }
        } else {
            nextPosition = allRecords[currentRecordIndex].position + 1;
        }

        let recordWithNewPositionIndex: number = allRecords.findIndex((record: AppContactsTableRecord): boolean => {
            return record.position == nextPosition;
        });

        if (currentRecordIndex < 0) {
            // something strange happened
            // we cannot be here now
            return;
        }

        allRecords[recordWithNewPositionIndex].position = allRecords[currentRecordIndex].position;
        allRecords[currentRecordIndex].position = nextPosition;

        this.table.setData(allRecords);
        this.table.refresh();
    }

    protected isMovingButtonDisabled(direction: 'up' | 'down'): boolean
    {
        if (direction === 'up') {
            return this.rowData.position < 1;
        }

        return this.rowData.position >= this.getContactTypeMaxPosition();
    }

    private getContactTypeMaxPosition(): number
    {
        let allRecords: AppContactsTableRecord[] = this.table.getData(),
            maxPosition: number = 0;

        allRecords.forEach((record: AppContactsTableRecord): void => {
            if (record.type === this.rowData.type && record.position > maxPosition) {
                maxPosition = record.position;
            }
        });

        return maxPosition;
    }
}
