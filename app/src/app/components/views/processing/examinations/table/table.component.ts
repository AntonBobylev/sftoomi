import { Component, signal, WritableSignal } from '@angular/core';
import { TuiHintDirective } from '@taiga-ui/core';
import { FormsModule } from '@angular/forms';
import { TuiCheckbox } from '@taiga-ui/kit';
import moment from 'moment/moment';

import Sftoomi from '../../../../../class/Sftoomi';

import Study from '../../../../../type/Study';
import Doctor from '../../../../../type/Doctor';
import Facility from '../../../../../type/Facility';

export type ProcessingModuleExaminationsPanelTableData = {
    rows: ProcessingModuleExaminationsPanelTableRowData[]
};

export type ProcessingModuleExaminationsPanelTableRowData = {
    examination_id: number,
    date: string,
    patient: {
        id: number
        first_name: string
        last_name: string
        middle_name?: string,
        dob?: string
        phone?: string
    },
    doctor?: Doctor,
    facility: Facility,
    studies: (Study & {
        exam_id: number
    })[]
};

@Component({
    selector: 'processing-module-examinations-panel-table',
    templateUrl: './table.component.html',
    imports: [
        FormsModule,
        TuiCheckbox,
        TuiHintDirective
    ],
    styleUrl: './table.component.less'
})

export default class ProcessingModuleExaminationsPanelTableComponent
{
    protected readonly data: WritableSignal<ProcessingModuleExaminationsPanelTableData> = signal<ProcessingModuleExaminationsPanelTableData>({rows: []});
    protected readonly selectedRowsIndexes: WritableSignal<number[]> = signal<number[]>([]);

    protected readonly moment = moment;

    protected readonly Sftoomi = Sftoomi;

    public refresh(): void
    {
        // TODO: add an implementation
    }

    public getSelectedRecords(): ProcessingModuleExaminationsPanelTableRowData[]
    {
        let me: this = this,
            records: ProcessingModuleExaminationsPanelTableRowData[] = [];

        this.selectedRowsIndexes().forEach(function (index: number): void {
            records.push(me.data().rows[index]);
        });

        return records;
    }

    public setData(data: ProcessingModuleExaminationsPanelTableData): void
    {
        this.data.set(data);
    }

    public getAllRowsSignal(): WritableSignal<ProcessingModuleExaminationsPanelTableData>
    {
        return this.data;
    }

    protected onRowSelected(event: any): void
    {
        let indexes: number[] = this.selectedRowsIndexes();

        if (event.selected) {
            if (indexes.includes(event.row_index)) {
                return;
            }

            indexes.push(event.row_index);
            this.selectedRowsIndexes.set(indexes);

            return;
        }

        let itemIndex: number = indexes.indexOf(event.row_index);
        if (itemIndex > -1) {
            indexes.splice(itemIndex, 1);
            this.selectedRowsIndexes.set(indexes);
        }
    }

    protected onSelectAllRowsClick(checked: boolean): void
    {
        if (!checked) {
            this.clearSelection();

            return;
        }

        let newSelections: number[] = [];
        this.data().rows.forEach(function (_row: ProcessingModuleExaminationsPanelTableRowData, index: number): void {
            newSelections.push(index);
        });

        this.selectedRowsIndexes.set(newSelections);
    }

    protected clearSelection(): void
    {
        this.selectedRowsIndexes.set([]);
    }
}
