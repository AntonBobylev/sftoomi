import { Component, signal, WritableSignal } from '@angular/core';
import { NgClass } from '@angular/common';
import { TuiHintDirective } from '@taiga-ui/core';

import Sftoomi from '../../../../class/Sftoomi';

export type AppItemSelectorDataListRow = {
    name: string,
    value: string,
    tooltip?: string
};

type Item = {
    selected: boolean
} & AppItemSelectorDataListRow;

@Component({
    selector: 'app-item-selector-data-list',
    templateUrl: './data-list.component.html',
    imports: [
        NgClass,
        TuiHintDirective
    ],
    styleUrl: './data-list.component.scss'
})

export default class AppItemSelectorDataListComponent
{
    protected readonly data: WritableSignal<Item[]> = signal<Item[]>([]);

    protected readonly Sftoomi = Sftoomi;

    public setData(data: AppItemSelectorDataListRow[]): void
    {
        this.data.set(data.map((row: AppItemSelectorDataListRow): Item => {
            return {
                selected: false,
                value:    row.value,
                name:     row.name,
                tooltip:  row.tooltip
            }
        }));
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
