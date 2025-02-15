import { Component, OnInit, signal, WritableSignal } from '@angular/core';

import AppTableImports from './app-table-imports';

import Fetcher from '../../../class/Fetcher';

import AppTableColumn from '../../../type/AppTableColumn';

@Component({
    selector: 'app-table',
    imports: [AppTableImports],
    templateUrl: './app-table.component.html',
    styleUrl: './app-table.component.scss'
})

export default class AppTableComponent implements OnInit
{
    protected readonly url: string = '';
    protected readonly toolbar: any | undefined;

    protected readonly isLoading: WritableSignal<boolean> = signal<boolean>(false);
    protected readonly data: WritableSignal<any[]> = signal<any[]>([]);

    protected readonly selectionRequired: boolean = true;

    protected readonly dataRoot: string = 'data';

    protected readonly columns: AppTableColumn[] = [];
    protected columnsNames: string[] = [];

    private originalReceivedData: any[] = [];

    ngOnInit(): void
    {
        if (this.selectionRequired) {
            this.columns.unshift({
                name: 'selection',
                caption: '',
                resizable: false
            });
        }

        this.columnsNames = this.columns.map((column: AppTableColumn): string => column.name);

        this.refresh();
    }

    public refresh(): void
    {
        if (!this.url) {
            return;
        }

        let me: this = this;
        me.isLoading.set(true);

        (new Fetcher).request({
            url: this.url,
            success: function (_response: any, _request: XMLHttpRequest, data: any): void {
                me.isLoading.set(false);
                me.originalReceivedData = data[me.dataRoot];

                me.data.set(me.convertReceivedDataToTableData(data[me.dataRoot]));
            },
            failure: function (): void {
                me.isLoading.set(false);
            }
        });
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
