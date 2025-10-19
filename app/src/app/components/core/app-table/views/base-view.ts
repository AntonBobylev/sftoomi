import { Directive, Input, WritableSignal } from '@angular/core'

import Sftoomi from '../../../../class/Sftoomi'

import AppTableComponent from '../app-table.component'

import AppTableColumn from '../../../../type/AppTableColumn'

@Directive()
export default abstract class AppTableBaseView
{
    @Input({required: true}) public table!: AppTableComponent;
    @Input({required: true}) public data!: WritableSignal<any[]>;
    @Input({required: true}) public columns!: AppTableColumn[];

    @Input({required: true}) public selectionRequired!: boolean;

    protected selectionInHeaderChecked: boolean = false;
    protected selectionInHeaderIntermediate: boolean = false;

    protected readonly Sftoomi = Sftoomi

    public refresh(): void
    {
        this.refreshCheckedStatus();
    }

    protected refreshCheckedStatus(): void
    {
        if (Sftoomi.isEmpty(this.data())) {
            this.selectionInHeaderChecked = false;
            this.selectionInHeaderIntermediate = false;

            return;
        }

        this.selectionInHeaderChecked = this.data().every((row) => row.selected);
        this.selectionInHeaderIntermediate = this.data().some((row) => row.selected) && !this.selectionInHeaderChecked;
    }

    protected onAllChecked(selected: boolean): void
    {
        this.data().map((row) => {
            row.selected = selected;

            return row;
        });

        this.refreshCheckedStatus();
    }

    protected onRowCheck(checked: boolean, row: any): void
    {
        row.selected = checked;
        this.refreshCheckedStatus();
    }

    protected getCellData(row: any, column: AppTableColumn): string
    {
        if (column.valueRenderer) {
            return column.valueRenderer(row[column.name]);
        }

        return row[column.name];
    }
}
