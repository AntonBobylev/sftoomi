import { AfterViewInit, Component, Input, signal, WritableSignal } from '@angular/core';

import AppTableImports from './imports';

import Sftoomi from '../../../class/Sftoomi';
import Fetcher from '../../../class/Fetcher';
import Timeout from '../../../class/Timeout';

import AppBaseFilters from '../app-base-filters';

import AppTableColumn from '../../../type/AppTableColumn';

@Component({
    selector: 'app-table',
    templateUrl: './app-table.component.html',
    imports: [AppTableImports],
    styleUrl: './app-table.component.less'
})

export default class AppTableComponent implements AfterViewInit
{
    @Input() public filtersCtrl: AppBaseFilters | undefined;

    protected readonly data: WritableSignal<any[]> = signal<any[]>([]);
    protected readonly total: WritableSignal<number> = signal<number>(0);

    protected readonly isLoading: WritableSignal<boolean> = signal<boolean>(false);

    protected readonly columns: AppTableColumn[] = [];

    protected readonly loadUrl: string | undefined;
    protected readonly loadTimeout: number = Timeout.timeout;

    protected readonly toolbarHeight: string = '40px';
    protected readonly toolbar: any | undefined;

    protected readonly noDataCaption: string = Sftoomi.Translator.translate('no_data_to_display');

    protected readonly isBordered: boolean = true;
    protected readonly selectionRequired: boolean = true;

    protected readonly lazyLoad: boolean = false;

    protected selectionInHeaderChecked: boolean = false;
    protected selectionInHeaderIntermediate: boolean = false;

    protected readonly usePagination: boolean = true;

    protected pageSize: number = 50;
    protected currentPageIndex: number = 1;

    ngAfterViewInit(): void
    {
        if (!this.lazyLoad) {
            this.refresh();
        }
    }

    public setIsLoading(isLoading: boolean): void
    {
        this.isLoading.set(isLoading);
    }

    public isLoadingNow(): boolean
    {
        return this.isLoading();
    }

    public setData(data: any[]): void
    {
        let conversionRequired: boolean = Sftoomi.isEmpty(this.data());
        if (conversionRequired) {
            this.convertReceivedDataToTableData(data);
        }

        this.data.set(data);
        this.refreshCheckedStatus();
    }

    public getData(): any[]
    {
        return this.data();
    }

    public refresh(filters?: FormData): void
    {
        if (Sftoomi.isEmpty(this.loadUrl)) {
            return;
        }

        filters = filters
            ? filters
            : !Sftoomi.isEmpty(this.filtersCtrl) ? Sftoomi.formValuesToFormData(this.filtersCtrl!.getValues()) : undefined;

        let data: FormData = filters ? filters : new FormData();
        if (this.usePagination) {
            data.append('limit', this.pageSize.toString());
            data.append('start', (this.currentPageIndex - 1).toString());
        }

        this.isLoading.set(true);
        new Fetcher().request({
            url: this.loadUrl!,
            timeout: this.loadTimeout,
            data: data,
            success: (_response: any, _request: any, result: any): void => {
                this.data.set(this.convertReceivedDataToTableData(result.data));
                this.total.set(result.total ?? 0);

                this.refreshCheckedStatus();
            },
            finally: (): void => {
                this.isLoading.set(false);
            }
        });
    }

    public getSelection(): any[]
    {
        return this.data().filter(function (row: any): boolean {
            return row.selected;
        });
    }

    protected onPageIndexChange(newPageIndex: number): void
    {
        this.currentPageIndex = newPageIndex;
        this.refresh();
    }

    protected onPageSizeChange(newPageSize: number): void
    {
        this.pageSize = newPageSize;
        this.currentPageIndex = 1;
        this.refresh();
    }

    protected getTableHeight(): string
    {
        let height: string = '100%';
        if (this.toolbar) {
            height = Sftoomi.format('calc(100% - {0})', [this.toolbarHeight]);
        }

        return height;
    }

    protected onAllChecked(selected: boolean): void
    {
        this.data().map((row) => {
            row.selected = selected;

            return row;
        });

        this.refreshCheckedStatus();
    }

    protected refreshCheckedStatus(): void
    {
        if (Sftoomi.isEmpty(this.data())) {
            this.selectionInHeaderChecked = false;
            this.selectionInHeaderIntermediate = false;

            return;
        }

        this.selectionInHeaderChecked = this.data().every((row) => row.selected);
        this.selectionInHeaderIntermediate = this.data().some((row) => row.selected) && !this.selectionInHeaderChecked;
    }

    protected onRowCheck(checked: boolean, row: any): void
    {
        row.selected = checked;
        this.refreshCheckedStatus();
    }

    private convertReceivedDataToTableData(data: any[]): any[]
    {
        data.forEach((row: any): void => {
            if (this.selectionRequired) {
                row.selected = false;
            }

            Object.keys(row).forEach((key: string): void => {
                let currentColumn: AppTableColumn | undefined;
                this.columns.every(function (column: AppTableColumn): boolean {
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

    protected readonly Sftoomi = Sftoomi;
}
