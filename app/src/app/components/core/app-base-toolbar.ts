import { Directive, Input, OnDestroy, ViewContainerRef } from '@angular/core';

import Sftoomi from '../../class/Sftoomi';
import Fetcher from '../../class/Fetcher';

import AppTableComponent from './app-table/app-table.component';
import { AppContactsTableRecord } from '../fields/app-contacts/table/table.component';

@Directive()
export default abstract class AppBaseToolbar implements OnDestroy
{
    @Input({required: true}) public readonly table!: AppTableComponent;

    protected abstract readonly editDialogAddTitle: string;
    protected abstract readonly editDialogEditTitle: string;

    protected readonly removeUrl?: string;

    protected readonly Sftoomi: typeof Sftoomi = Sftoomi;

    protected readonly queryController: AbortController = new AbortController();

    protected abstract openEditDialog(title: string, id?: number): void;

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
            id
        );
    }

    protected onRemoveClick(event: MouseEvent): void
    {
        event.stopPropagation();

        if (!this.removeUrl) {
            this.onLocalRemove();

            return;
        }

        let selectedRecords: any[] = this.table.getSelection();
        if (selectedRecords.length < 1) {
            Sftoomi.popupMsgService?.nothingSelected();

            return;
        }

        let me: this = this,
            data: FormData = new FormData();

        data.append('ids', selectedRecords.map(function (record: any): number {
            return record.id;
        }).join(','));

        me.table.setIsLoading(true);
        new Fetcher().request({
            url: this.removeUrl,
            signal: this.queryController.signal,
            data: data,
            success: function (_response: any, _request: any, _data: any): void {
                me.table.setIsLoading(false);

                me.table.refresh();
            },
            failure: function (): void {
                me.table.setIsLoading(false);
            }
        });
    }

    ngOnDestroy(): void
    {
        this.queryController.abort();
    }

    private onLocalRemove(): void
    {
        let selectedRows: any[] = this.table.getSelection();
        if (Sftoomi.isEmpty(selectedRows)) {
            Sftoomi.popupMsgService?.nothingSelected();

            return;
        }

        let currentRows: AppContactsTableRecord[] = this.table.getData();
        selectedRows.forEach((selectedRow: AppContactsTableRecord): void => {
            currentRows = currentRows.filter((row: AppContactsTableRecord): boolean => row !== selectedRow);
        });

        this.table.setData(currentRows);
    }
}
