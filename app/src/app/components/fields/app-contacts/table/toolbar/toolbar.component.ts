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

    protected openEditDialog(title: string, id?: number, additionalData?: ContactsEditDialogData): void
    {
        const modal = Sftoomi.Dialog.getInstance().create<ContactsEditDialogComponent, ContactsEditDialogData>({
            nzTitle: title,
            nzContent: ContactsEditDialogComponent,
            nzViewContainerRef: this.viewContainerRef,
            nzMaskClosable: false,
            nzCentered: true,
            nzData: additionalData
        });

        modal.afterClose.subscribe((isSaved: boolean = false): void => {
            if (isSaved) {
                this.table.refresh();
            }
        });
    }

    protected override getAdditionalDataOnEditDialogOpen(data: AppContactsTableRecord): any
    {
        return data;
    }
}
