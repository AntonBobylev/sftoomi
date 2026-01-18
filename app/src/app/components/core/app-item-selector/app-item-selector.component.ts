import { Component, Input, Signal, viewChild } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzFormLabelComponent } from 'ng-zorro-antd/form';

import Sftoomi from '../../../class/Sftoomi';

import AppItemSelectorDataListComponent, { AppItemSelectorDataListRow } from './data-list/data-list.component';

@Component({
    selector: 'app-item-selector',
    templateUrl: './app-item-selector.component.html',
    imports: [
        AppItemSelectorDataListComponent, NzButtonComponent,
        NzTooltipDirective, NzIconDirective, NzColDirective, NzFormLabelComponent
    ],
    styleUrl: './app-item-selector.component.scss'
})

export default class AppItemSelectorComponent
{
    @Input() public label: string | undefined;
    @Input() public required: boolean = false;

    private readonly leftList:  Signal<AppItemSelectorDataListComponent | undefined> = viewChild('left');
    private readonly rightList: Signal<AppItemSelectorDataListComponent | undefined> = viewChild('right');

    protected readonly Sftoomi = Sftoomi;

    public setData(leftData: AppItemSelectorDataListRow[], rightData: AppItemSelectorDataListRow[]): void
    {
        this.leftList()?.setData(leftData);
        this.rightList()?.setData(rightData);
    }

    public getLeftListData(): AppItemSelectorDataListRow[]
    {
        if (!this.leftList()) {
            return [];
        }

        return this.leftList()!.getAllRows();
    }

    public getRightListData(): AppItemSelectorDataListRow[]
    {
        if (!this.rightList()) {
            return [];
        }

        return this.rightList()!.getAllRows();
    }

    protected onMoveRightClick(): void
    {
        this.moveRows(this.leftList()!, this.rightList()!);
    }

    protected onMoveLeftClick(): void
    {
        this.moveRows(this.rightList()!, this.leftList()!);
    }

    protected onMoveAllLeftClick(): void
    {
        this.moveRows(this.rightList()!, this.leftList()!, true);
    }

    protected onMoveAllRightClick(): void
    {
        this.moveRows(this.leftList()!, this.rightList()!, true);
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
