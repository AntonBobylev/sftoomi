import { Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { tuiCeil, TuiContext, TuiStringHandler } from '@taiga-ui/cdk';

import Sftoomi from '../../../class/Sftoomi';

import AppTableImports from './app-table-imports';

import Fetcher from '../../../class/Fetcher';
import AppTableColumn from '../../../type/AppTableColumn';
import AppTableColumnStyles from '../../../type/AppTableColumnStyles';

@Component({
    selector: 'app-table',
    imports: [AppTableImports],
    templateUrl: './app-table.component.html',
    styleUrl: './app-table.component.scss'
})

export default class AppTableComponent implements OnInit, OnDestroy
{
    protected readonly url: string = '';
    protected readonly toolbar: any | undefined;

    protected readonly isLoading: WritableSignal<boolean> = signal<boolean>(false);
    protected readonly data: WritableSignal<any[]> = signal<any[]>([]);

    protected readonly selectionRequired: boolean = true;
    private readonly defaultSelectionColumn: AppTableColumn = {
        name: 'selection',
        caption: '',
        resizable: false,
        headerStyles: {
            alignment: 'center'
        },
        styles: {
            width: '50px',
            alignment: 'center'
        }
    };

    protected readonly dataRoot: string = 'data';

    protected readonly columns: AppTableColumn[] = [];
    protected columnsNames: string[] = [];

    protected readonly queryController: AbortController = new AbortController();

    protected readonly paginatorRequired: boolean = false;
    protected itemsPerPage: number = 50;
    protected totalPagesCount: number = 1;
    protected currentPageIndex: number = 0;

    protected readonly Sftoomi = Sftoomi;

    protected readonly items = [5, 10, 15, 25, 50, 100];
    protected readonly content: TuiStringHandler<TuiContext<number>> = function ({$implicit}: TuiContext<number>): string {
        return Sftoomi.format(
            '{0} {1}',
            [
                $implicit,
                Sftoomi.Translator.translate('base_table.items_per_page')
            ]
        );
    }

    protected pageSizeCaption: string = '';

    private originalReceivedData: any[] = [];
    private totalRowsCount: number = 0;

    ngOnInit(): void
    {
        if (this.selectionRequired) {
            this.columns.unshift(this.defaultSelectionColumn);
        }

        this.columnsNames = this.columns.map((column: AppTableColumn): string => column.name);

        this.refresh();
    }

    ngOnDestroy(): void
    {
        this.queryController.abort();
    }

    public setIsLoading(isLoading: boolean): void
    {
        this.isLoading.set(isLoading);
    }

    public refresh(): void
    {
        if (!this.url) {
            return;
        }

        let me: this = this;
        me.isLoading.set(true);

        let formData = new FormData();
        if (me.paginatorRequired) {
            formData.set('start', me.currentPageIndex.toString());
            formData.set('limit', me.itemsPerPage.toString());
        }

        (new Fetcher).request({
            url: this.url,
            data: formData,
            signal: this.queryController.signal,
            success: function (_response: any, _request: XMLHttpRequest, data: any): void {
                me.isLoading.set(false);
                me.originalReceivedData = data[me.dataRoot];

                me.totalRowsCount = data.total;
                if (me.paginatorRequired) {
                    me.totalPagesCount = tuiCeil(data.total / me.itemsPerPage);
                }

                me.updatePageSizeCaption();

                me.data.set(me.convertReceivedDataToTableData(data[me.dataRoot]));
            },
            failure: function (): void {
                me.isLoading.set(false);
            }
        });
    }

    public getSelection(): any[]
    {
        return this.data().filter(function (row: any): boolean {
            return row.selected;
        });
    }

    public isAllSelected(): boolean
    {
        return this.data().length === this.getSelection().length;
    }

    protected get checked(): boolean | null
    {
        const every: boolean = this.data().every(({selected}) => selected);
        const some: boolean = this.data().some(({selected}) => selected);

        return every || (some && null);
    }

    protected onCheck(checked: boolean): void
    {
        this.data().forEach((item: any): void => {
            item.selected = checked;
        });
    }

    protected getColumnWidth(columnWidth?: AppTableColumnStyles['width']): string | null
    {
        if (!columnWidth) {
            return null;
        }

        return columnWidth;
    }

    protected onPageChange(newPageNumber: number): void
    {
        this.currentPageIndex = newPageNumber;
        this.updatePageSizeCaption();

        this.refresh();
    }

    protected onPageSizeChange(newSize: number): void
    {
        this.itemsPerPage = newSize;
        this.currentPageIndex = 0;

        this.refresh();
    }

    protected updatePageSizeCaption(): void
    {
        let from: number = (this.currentPageIndex * this.itemsPerPage) + 1,
            to: number = (this.currentPageIndex + 1) * this.itemsPerPage;

        if (to > this.totalRowsCount) {
            to = this.totalRowsCount;
        }

        this.pageSizeCaption = Sftoomi.format(
            '{0}-{1} {2}',
            [
                from,
                to,
                Sftoomi.Translator.translate('base_table.rows')
            ]
        );
    }

    private convertReceivedDataToTableData(data: any[]): any[]
    {
        let columns: AppTableColumn[] = this.columns,
            me: this = this;

        data.forEach(function (row: any): void {
            if (me.selectionRequired) {
                row.selected = false;
            }

            Object.keys(row).forEach(function (key: string): void {
                let currentColumn: AppTableColumn | undefined;
                columns.every(function (column: AppTableColumn): boolean {
                    if (column.name === key) {
                        currentColumn = column;

                        return false;
                    }

                    return true;
                })

                if (currentColumn && currentColumn.valueRenderer) {
                    row[key] = currentColumn.valueRenderer(row[key]);
                }
            });
        })

        return data;
    }
}
