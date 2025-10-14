import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { NzButtonComponent } from 'ng-zorro-antd/button'
import { NZ_MODAL_DATA, NzModalFooterDirective } from 'ng-zorro-antd/modal'

import AppBaseEditDialog from '../../../../core/app-base-edit-dialog/app-base-edit-dialog';
import { AppContactType } from '../table.component'

export type ContactsEditDialogData = {
    item_id?: number,
    type:     AppContactType,
    position: number,
    text:     string
};

@Component({
    selector: 'contacts-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        ReactiveFormsModule,
        NzModalFooterDirective,
        NzButtonComponent
    ],
    styleUrl: './dialog.component.less'
})

export default class ContactsEditDialogComponent extends AppBaseEditDialog
{
    protected override readonly data: ContactsEditDialogData = inject(NZ_MODAL_DATA);

    protected readonly form: FormGroup = new FormGroup({
    });

    protected afterLoad(data?: ContactsEditDialogData): void
    {
    }

    protected override getAdditionalDataOnSave(data: FormData): FormData
    {
        return data;
    }
}
