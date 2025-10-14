import { Directive, Input, ViewContainerRef } from '@angular/core';

import Sftoomi from '../../class/Sftoomi';

import AppTableComponent from './app-table/app-table.component';

@Directive()
export default abstract class AppBaseToolbar
{
    @Input({required: true}) public readonly table!: AppTableComponent;

    protected abstract readonly editDialogAddTitle: string;
    protected abstract readonly editDialogEditTitle: string;

    protected readonly Sftoomi: typeof Sftoomi = Sftoomi;

    protected abstract openEditDialog(title: string, id?: number, additionalData?: any): void;

    constructor(protected readonly viewContainerRef: ViewContainerRef)
    {
    }

    protected onRefreshClick(): void
    {
        this.table.refresh();
    }

    protected onAddClick(event: MouseEvent): void
    {
        event.stopPropagation();

        this.openEditDialog(this.editDialogAddTitle);
    }

    protected onEditClick(event: MouseEvent): void
    {
        event.stopPropagation();

        let selectedRecords: any[] = this.table.getSelection();
        if (selectedRecords.length < 1) {
            Sftoomi.popupMsgService?.nothingSelected();

            return;
        }

        if (selectedRecords.length > 1) {
            Sftoomi.popupMsgService?.moreThanOneSelected();

            return;
        }

        let id: number = selectedRecords[0].id;
        this.openEditDialog(
            Sftoomi.format(this.editDialogEditTitle, [id]),
            id,
            this.getAdditionalDataOnEditDialogOpen(selectedRecords[0])
        );
    }

    protected onRemoveClick(): void
    {
        this.table.removeSelected();
    }

    protected getAdditionalDataOnEditDialogOpen(_data: any): any
    {
        return undefined;
    }
}
