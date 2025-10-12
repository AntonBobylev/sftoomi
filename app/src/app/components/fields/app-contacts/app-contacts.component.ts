import { Component, ViewChild } from '@angular/core';

import AppContactsTableComponent from './table/table.component';

export type AppContactsTableRecord = {
    item_id:  number,
    type:     string,
    position: number,
    text:     string
};

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
    }
}
