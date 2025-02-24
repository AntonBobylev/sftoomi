import { Component, ViewChild } from '@angular/core';
import { TuiButton, TuiHintDirective } from '@taiga-ui/core';

import Sftoomi from '../../../class/Sftoomi';

import AppItemSelectorDataListComponent, { AppItemSelectorDataListRow } from './data-list/data-list.component';

@Component({
    selector: 'app-item-selector',
    templateUrl: './app-item-selector.component.html',
    imports: [
        AppItemSelectorDataListComponent,
        TuiButton,
        TuiHintDirective
    ],
    styleUrl: './app-item-selector.component.scss'
})

export default class AppItemSelectorComponent
{
    @ViewChild('left')
    protected readonly leftList!: AppItemSelectorDataListComponent;

    @ViewChild('right')
    protected readonly rightList!: AppItemSelectorDataListComponent;

    protected readonly Sftoomi = Sftoomi;

    public setData(leftData: AppItemSelectorDataListRow[], rightData: AppItemSelectorDataListRow[]): void
    {
        this.leftList.setData(leftData);
        this.rightList.setData(rightData);
    }

    public getLeftListData(): AppItemSelectorDataListRow[]
    {
        return this.leftList.getAllRows();
    }

    public getRightListData(): AppItemSelectorDataListRow[]
    {
        return this.rightList.getAllRows();
    }

    protected onMoveRightClick(): void
    {
        this.moveRows(this.leftList, this.rightList);
    }

    protected onMoveLeftClick(): void
    {
        this.moveRows(this.rightList, this.leftList);
    }

    protected onMoveAllLeftClick(): void
    {
        this.moveRows(this.rightList, this.leftList, true);
    }

    protected onMoveAllRightClick(): void
    {
        this.moveRows(this.leftList, this.rightList, true);
    }

    private moveRows(from: AppItemSelectorDataListComponent, to: AppItemSelectorDataListComponent, moveAll: boolean = false): void
    {
        let fromItems: AppItemSelectorDataListRow[] = from.getAllRows(),
            toItems: AppItemSelectorDataListRow[] = to.getAllRows(),
            newFromData: AppItemSelectorDataListRow[] = [],
            newToData: AppItemSelectorDataListRow[] = [];

        if (moveAll) {
            newToData = [
                ...fromItems,
                ...toItems
            ];

            newFromData = [];
        } else {
            let fromSelectedItems: AppItemSelectorDataListRow[] = from.getSelected();
            if (fromSelectedItems.length < 1) {
                return;
            }

            let fromListNewData: AppItemSelectorDataListRow[] = fromItems;
            fromSelectedItems.forEach(function (selectedItem: AppItemSelectorDataListRow): void {
                fromListNewData = fromListNewData.filter(function (item: AppItemSelectorDataListRow): boolean {
                    return selectedItem.value !== item.value;
                });
            });

            newFromData = fromListNewData;
            newToData = [
                ...toItems,
                ...fromSelectedItems
            ];
        }

        from.setData(newFromData);
        to.setData(newToData);
    }
}
