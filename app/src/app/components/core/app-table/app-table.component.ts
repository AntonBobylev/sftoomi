import { AfterViewInit, Component, signal, WritableSignal } from '@angular/core';

import AppTableImports from './imports';

import Sftoomi from '../../../class/Sftoomi';
import Fetcher from '../../../class/Fetcher';
import Timeout from '../../../class/Timeout';

import AppTableColumn from '../../../type/AppTableColumn';

@Component({
    selector: 'app-table',
    templateUrl: './app-table.component.html',
    imports: [AppTableImports],
    styleUrl: './app-table.component.scss'
})

export default class AppTableComponent implements AfterViewInit
{
    protected readonly data: WritableSignal<any[]> = signal<any[]>([]);
    protected readonly total: WritableSignal<number> = signal<number>(0);

    protected readonly isLoading: WritableSignal<boolean> = signal<boolean>(false);

    protected readonly columns: AppTableColumn[] = [];

    protected readonly loadUrl!: string;
    protected readonly loadTimeout: number = Timeout.timeout;

    protected readonly noDataCaption: string = Sftoomi.Translator.translate('no_data_to_display');

    protected readonly isBordered: boolean = true;
    protected readonly selectionRequired: boolean = true;

    protected readonly usePagination: boolean = true;

    protected pageSize: number = 50;
    protected currentPageIndex: number = 1;

    ngAfterViewInit(): void
    {
        this.refresh();
    }

    protected getColumnsNames(): string[]
    {
        return this.columns.map((column: AppTableColumn): string => column.name);
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

    private refresh(): void
    {
        let data: FormData = new FormData();
        if (this.usePagination) {
            data.append('limit', this.pageSize.toString());
            data.append('start', (this.currentPageIndex - 1).toString());
        }

        this.isLoading.set(true);
        new Fetcher().request({
            url: this.loadUrl,
            timeout: this.loadTimeout,
            data: data,
            success: (_response: any, _request: any, result: any): void => {
                this.data.set(this.convertReceivedDataToTableData(result.data));
                this.total.set(result.total ?? 0);
            },
            finally: (): void => {
                this.isLoading.set(false);
            }
        });
    }
}
