import { Component } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';

import Sftoomi from '../../../../../class/Sftoomi';

import AppBaseToolbar from '../../../../core/app-base-toolbar';

import ContactsEditDialogComponent, { ContactsEditDialogData } from '../dialog/dialog.component'
import { AppContactsTableRecord } from '../table.component'

@Component({
    selector: 'users-table-toolbar',
    templateUrl: './toolbar.component.html',
    imports: [
        NzButtonComponent,
        NzIconDirective,
        NzTooltipDirective
    ]
})

export default class AppContactsTableToolbarComponent extends AppBaseToolbar
{
    protected override readonly editDialogAddTitle: string = Sftoomi.Translator.translate('fields.contacts.dialog.add_title');
    protected override readonly editDialogEditTitle: string = Sftoomi.Translator.translate('fields.contacts.dialog.edit_title');

    protected openEditDialog(title: string, _id?: number, additionalData?: AppContactsTableRecord): void
    {
        let currentRecordIndex: number | undefined;
        if (additionalData) {
            let data: AppContactsTableRecord[] = this.table.getData();
            currentRecordIndex = data.findIndex((record: AppContactsTableRecord): boolean => record === additionalData);
            if (currentRecordIndex < 0) {
                currentRecordIndex = undefined;
            }
        }

        const modal = Sftoomi.Dialog.getInstance().create<ContactsEditDialogComponent, ContactsEditDialogData>({
            nzTitle: title,
            nzContent: ContactsEditDialogComponent,
            nzViewContainerRef: this.viewContainerRef,
            nzMaskClosable: false,
            nzCentered: true,
            nzData: additionalData
        });

        modal.afterClose.subscribe((contact?: ContactsEditDialogData): void => {
            if (!contact) {
                return;
            }

            let records: AppContactsTableRecord[] = this.table.getData(),
                recordIndex: number = currentRecordIndex ?? -1;

            if (recordIndex >= 0) {
                records[recordIndex] = {
                    ...records[recordIndex],
                    ...contact
                };
            } else {
                const lastPosition: number = records
                    .filter((record: AppContactsTableRecord): boolean => record.type === contact.type)
                    .reduce((max: number, record: AppContactsTableRecord): number => Math.max(max, record.position), 0);

                const newRecord: AppContactsTableRecord = {
                    ...contact,
                    position: lastPosition + 1
                };

                records.push(newRecord);
            }

            this.table.setData(records);
            this.table.refresh();
        });
    }
}
