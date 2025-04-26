import { Component, effect, Input, signal, WritableSignal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiComboBoxModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { TuiDataListWrapper, TuiDataListWrapperComponent, TuiFieldErrorPipe, TuiFilterByInputPipe, TuiStringifyContentPipe } from '@taiga-ui/kit';
import { TuiError } from '@taiga-ui/core';

import AppBaseField from '../app-base-field';

export type AppComboboxRecord = {
    value: string | number,
    title: string
};

@Component({
    selector: 'app-combo-box',
    templateUrl: './app-combo-box.component.html',
    imports: [
        AsyncPipe, ReactiveFormsModule,
        TuiComboBoxModule, TuiDataListWrapper,
        TuiDataListWrapperComponent, TuiError,
        TuiFieldErrorPipe, TuiFilterByInputPipe,
        TuiStringifyContentPipe, TuiTextfieldControllerModule
    ],
    styleUrl: './app-combo-box.component.scss'
})

export default class AppComboBoxComponent extends AppBaseField
{
    @Input({required: true}) public store: WritableSignal<AppComboboxRecord[]> = signal([]);
    @Input() public filterFn?: Function;

    protected readonly stringify = (value: number): string =>
        this.store().find(function (item: AppComboboxRecord): boolean {
            return item.value.toString() === value.toString();
        })?.title || '';

    protected items: string[] = [];

    constructor()
    {
        super();

        let me: this = this;
        effect((): void => {
            me.items = me.recordsToValuesOnlyArray(me.store());
        })
    }

    public updateFilters(filters: any | undefined): void
    {
        let me: this = this;
        if (me.filterFn) {
            let filteredRecords: string[] = me.recordsToValuesOnlyArray(me.store());
            me.items = filteredRecords.filter(function (value: string): boolean {
                return me.filterFn!(value, filters);
            })
        }
    }

    private recordsToValuesOnlyArray(records: AppComboboxRecord[]): string[]
    {
        return records.map(({value}: AppComboboxRecord): string => value.toString())
    }
}
