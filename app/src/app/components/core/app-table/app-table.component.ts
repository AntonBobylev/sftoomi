import { AfterViewInit, Component, signal, WritableSignal } from '@angular/core';

import AppTableImports from './imports';

import Sftoomi from '../../../class/Sftoomi';
import Fetcher from '../../../class/Fetcher';
import Timeout from '../../../class/Timeout';

import getPatientsAPI from '../../../APIs/getPatientsAPI'

import AppTableColumn from '../../../type/AppTableColumn';

@Component({
    selector: 'app-table',
    templateUrl: './app-table.component.html',
    imports: [ AppTableImports ],
    styleUrl: './app-table.component.scss'
})

export default class AppTableComponent implements AfterViewInit
{
    protected readonly data: WritableSignal<any[]> = signal<any[]>([]);

    protected readonly isLoading: WritableSignal<boolean> = signal<boolean>(false);

    protected readonly columns: AppTableColumn[] = [];

    protected readonly loadUrl!: string;
    protected readonly loadTimeout: number = Timeout.timeout;

    protected readonly noDataCaption: string = Sftoomi.Translator.translate('no_data_to_display');

    protected readonly isBordered: boolean = true;
    protected readonly selectionRequired: boolean = true;

    ngAfterViewInit(): void
    {
        this.isLoading.set(true);
        new Fetcher().request({
            url: this.loadUrl,
            timeout: this.loadTimeout,
            success: (_response: any, _request: any, result: getPatientsAPI): void => {
                this.data.set(this.convertReceivedDataToTableData(result.data));
            },
            finally: (): void => {
                this.isLoading.set(false);
            }
        });
    }

    protected getColumnsNames(): string[]
    {
        return this.columns.map((column: AppTableColumn): string => column.name);
    }

    protected getTotalRowsCount(): number
    {
        return this.data().length + 1;
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
}
