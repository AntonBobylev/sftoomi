import { Component, ViewChild } from '@angular/core';

import Sftoomi from '../../../class/Sftoomi';

import AppContactsTableComponent, { AppContactsTableRecord } from './table/table.component';

@Component({
    selector: 'app-contacts',
    templateUrl: './app-contacts.component.html',
    imports: [
        AppContactsTableComponent
    ],
    styleUrl: 'app-contacts.component.less'
})

export default class AppContactsComponent
{
    @ViewChild('tableCtrl')
    private readonly tableCtrl!: AppContactsTableComponent;

    public setData(records: AppContactsTableRecord[]): void
    {
        this.tableCtrl.setData(records);
        this.sortTableData();
    }

    protected afterRemoveRecordsInTable(): void
    {
        this.sortTableData();
    }

    protected afterTableRefresh(): void
    {
        this.sortTableData();
    }

    private sortTableData(): void
    {
        let data: AppContactsTableRecord[] = this.tableCtrl.getData();
        if (Sftoomi.isEmpty(data)) {
            return;
        }

        let contactsByTypes: any = {};
        data.forEach((record: AppContactsTableRecord): void => {
            if (!contactsByTypes[record.type]) {
                contactsByTypes[record.type] = [];
            }

            contactsByTypes[record.type].push(record);
        });

        let newData: AppContactsTableRecord[] = [];
        Object.entries(contactsByTypes).forEach(([_type, contacts]): void => {
            (contacts as AppContactsTableRecord[])
                .sort((a: AppContactsTableRecord, b: AppContactsTableRecord) => a.position - b.position)
                .map((contact: AppContactsTableRecord, index: number): AppContactsTableRecord => { return {...contact, position: index }; })
                .forEach((contact: AppContactsTableRecord): void => { newData.push(contact); })
        });

        this.tableCtrl.setData(newData);
        this.tableCtrl.clearSelection();
    }
}
