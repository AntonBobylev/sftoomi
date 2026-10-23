import { Component, DestroyRef, inject, input, InputSignal, signal, WritableSignal, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';

import Sftoomi from '../../../../class/Sftoomi';

import AppTextFieldComponent from '../../app-text-field/app-text-field.component';

export interface AppItemSelectorDataListRow {
    name:     string,
    value:    string,
    tooltip?: string
}

type Item = {
    selected: boolean
} & AppItemSelectorDataListRow;

@Component({
    selector: 'app-item-selector-data-list',
    templateUrl: './data-list.component.html',
    imports: [
        NgClass,
        NzTooltipDirective,
        AppTextFieldComponent
    ],
    styleUrl: './data-list.component.less'
})

export default class AppItemSelectorDataListComponent implements OnInit
{
    public readonly title:     InputSignal<string>  = input.required();
    public readonly useFilter: InputSignal<boolean> = input(true);

    protected readonly data:         WritableSignal<Item[]> = signal([]);
    protected readonly filteredData: WritableSignal<Item[]> = signal([]);

    protected form = new FormGroup({
        filter: new FormControl<string | null>(null)
    });

    protected readonly Sftoomi: typeof Sftoomi = Sftoomi;

    private readonly destroyRef: DestroyRef = inject(DestroyRef);

    ngOnInit(): void
    {
        this.form.get('filter')
            ?.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((query: string | null): void => {
                const items: Item[] = this.data();

                if (typeof query !== 'string') {
                    this.filteredData.set(items);

                    return;
                }

                query = query.toLowerCase().trim();
                if (!query) {
                    this.filteredData.set(items);

                    return;
                }

                this.filteredData.set(items.filter(row =>
                    row.name.toLowerCase().includes(query)
                    || row.value.toLowerCase().includes(query)
                    || row.tooltip?.toLowerCase().includes(query)
                ));
            });
    }

    public setData(data: AppItemSelectorDataListRow[]): void
    {
        this.data.set(data.map((row: AppItemSelectorDataListRow): Item => ({
            selected: false,
            value:    row.value,
            name:     row.name,
            tooltip:  row.tooltip
        })));

        this.filteredData.set(this.data());
    }

    public getAllRows(): AppItemSelectorDataListRow[]
    {
        return this.data();
    }

    public getSelected(): AppItemSelectorDataListRow[]
    {
        return this.data().filter((row: Item): boolean => row.selected);
    }

    protected onItemClick(event: MouseEvent, row: Item): void
    {
        event.stopPropagation();

        row.selected = !row.selected;
    }
}
