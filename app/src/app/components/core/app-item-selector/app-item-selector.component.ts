import { Component, input, InputSignal, Signal, viewChild } from '@angular/core';
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
    public readonly label:    InputSignal<string | null> = input<string | null>(null);
    public readonly required: InputSignal<boolean>       = input(false);

    private readonly leftList:  Signal<AppItemSelectorDataListComponent> = viewChild.required('left');
    private readonly rightList: Signal<AppItemSelectorDataListComponent> = viewChild.required('right');

    protected readonly Sftoomi: typeof Sftoomi = Sftoomi;

    public setData(leftData: AppItemSelectorDataListRow[], rightData: AppItemSelectorDataListRow[]): void
    {
        this.leftList().setData(leftData);
        this.rightList().setData(rightData);
    }

    public getLeftListData(): AppItemSelectorDataListRow[]
    {
        return this.leftList().getAllRows();
    }

    public getRightListData(): AppItemSelectorDataListRow[]
    {
        return this.rightList().getAllRows();
    }

    protected onMoveRightClick(): void
    {
        this.moveRows(this.leftList(), this.rightList());
    }

    protected onMoveLeftClick(): void
    {
        this.moveRows(this.rightList(), this.leftList());
    }

    protected onMoveAllLeftClick(): void
    {
        this.moveRows(this.rightList(), this.leftList(), true);
    }

    protected onMoveAllRightClick(): void
    {
        this.moveRows(this.leftList(), this.rightList(), true);
    }

    protected getButtonConfig(buttonIndex: 1 | 2 | 3 | 4): { tooltip: string, callback: Function, icon: string }
    {
        const isMobile: boolean = this.Sftoomi.responsiveLayoutService?.isSmallWidth() ?? false;
        switch (buttonIndex) {
            case 1:
                return {
                    tooltip: this.Sftoomi.Translator.translate(
                        isMobile ? 'fields.item_selector.move_all_up' : 'fields.item_selector.move_all_right'
                    ),
                    callback: isMobile ? this.onMoveAllLeftClick : this.onMoveAllRightClick,
                    icon:     isMobile ? 'caret-up' : 'double-right'
                };
            case 2:
                return {
                    tooltip: this.Sftoomi.Translator.translate(
                        isMobile ? 'fields.item_selector.move_up' : 'fields.item_selector.move_right'
                    ),
                    callback: isMobile ? this.onMoveLeftClick : this.onMoveRightClick,
                    icon:     isMobile ? 'up' : 'right'
                };
            case 3:
                return {
                    tooltip: this.Sftoomi.Translator.translate(
                        isMobile ? 'fields.item_selector.move_down' : 'fields.item_selector.move_left'
                    ),
                    callback: isMobile ? this.onMoveRightClick : this.onMoveLeftClick,
                    icon:     isMobile ? 'down' : 'left'
                };
            case 4:
                return {
                    tooltip: this.Sftoomi.Translator.translate(
                        isMobile ? 'fields.item_selector.move_all_down' : 'fields.item_selector.move_all_left'
                    ),
                    callback: isMobile ? this.onMoveAllRightClick : this.onMoveAllLeftClick,
                    icon:     isMobile ? 'caret-down' : 'double-left'
                };
        }
    }

    private moveRows(from: AppItemSelectorDataListComponent, to: AppItemSelectorDataListComponent, moveAll: boolean = false): void
    {
        const fromItems: AppItemSelectorDataListRow[] = from.getAllRows(),
              toItems:   AppItemSelectorDataListRow[] = to.getAllRows();

        if (moveAll) {
            from.setData([]);
            to.setData([...fromItems, ...toItems]);

            return;
        }

        const selectedItems: AppItemSelectorDataListRow[] = from.getSelected();
        if (this.Sftoomi.isEmpty(selectedItems)) {
            return;
        }

        const selectedValues = new Set(selectedItems.map(item => item.value)),
              newFromData: AppItemSelectorDataListRow[] = fromItems.filter(item => !selectedValues.has(item.value));

        from.setData(newFromData);

        to.setData([...toItems, ...selectedItems]);
    }
}
