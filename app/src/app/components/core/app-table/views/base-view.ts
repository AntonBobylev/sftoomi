import { Directive, input, InputSignal, WritableSignal } from '@angular/core';

import Sftoomi from '../../../../class/Sftoomi'

import AppTableComponent from '../app-table.component'

import AppTableColumn from '../../../../interfaces/AppTableColumn'

@Directive()
export default abstract class AppTableBaseView
{
    public readonly table:             InputSignal<AppTableComponent>     = input.required();
    public readonly data:              InputSignal<WritableSignal<any[]>> = input.required(); // TODO: remove any, gotta use strict type
    public readonly columns:           InputSignal<AppTableColumn[]>      = input.required();
    public readonly selectionRequired: InputSignal<boolean>               = input.required();

    protected selectionInHeaderChecked:      boolean = false;
    protected selectionInHeaderIntermediate: boolean = false;

    protected readonly Sftoomi: typeof Sftoomi = Sftoomi

    public refresh(): void
    {
        this.refreshCheckedStatus();
    }

    protected refreshCheckedStatus(): void
    {
        const data = this.data()();

        if (Sftoomi.isEmpty(data)) {
            this.selectionInHeaderChecked = false;
            this.selectionInHeaderIntermediate = false;

            return;
        }

        this.selectionInHeaderChecked = data.every((row) => row.selected);
        this.selectionInHeaderIntermediate = data.some((row) => row.selected) && !this.selectionInHeaderChecked;
    }

    protected onAllChecked(selected: boolean): void
    {
        this.data().update(rows =>
            rows.map(row => ({ ...row, selected: selected }))
        );

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
