import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { NzButtonComponent } from 'ng-zorro-antd/button'
import { NZ_MODAL_DATA, NzModalFooterDirective } from 'ng-zorro-antd/modal'

import Sftoomi from '../../../../../class/Sftoomi'

import AppBaseEditDialog from '../../../../core/app-base-edit-dialog/app-base-edit-dialog';

import { AppContactType } from '../table.component'
import AppComboComponent, { AppComboRecord } from '../../../../core/app-combo/app-combo.component'
import AppTextfieldComponent from '../../../../core/app-textfield/app-textfield.component'

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
        NzButtonComponent,
        AppComboComponent,
        AppTextfieldComponent
    ],
    styleUrl: './dialog.component.less'
})

export default class ContactsEditDialogComponent extends AppBaseEditDialog
{
    @ViewChild('typeCtrl')
    protected readonly typeCtrl!: AppComboComponent;

    protected override readonly data: ContactsEditDialogData | undefined = inject(NZ_MODAL_DATA);

    protected readonly form: FormGroup = new FormGroup({
        type:     new FormControl<AppContactType | null>(null, [Validators.required]),
        text:     new FormControl<string | null>(null, [Validators.required]),
        item_id:  new FormControl<number | undefined>(undefined),
        position: new FormControl<number | undefined>(undefined)
    });

    protected override readonly width: string | number | undefined = 300;

    protected readonly availableTypes: AppComboRecord[] = [{
        caption: Sftoomi.Translator.translate('fields.contacts.email'),
        value: 'email'
    }, {
        caption: Sftoomi.Translator.translate('fields.contacts.address'),
        value: 'address'
    }, {
        caption: Sftoomi.Translator.translate('fields.contacts.phone'),
        value: 'phone'
    }];

    protected afterLoad(data?: ContactsEditDialogData): void
    {
        this.typeCtrl.setData(this.availableTypes);

        if (!data) {
            return;
        }

        this.form.get('type')?.setValue(data.type);
        this.form.get('text')?.setValue(data.text);
        this.form.get('position')?.setValue(data.position);
        this.form.get('item_id')?.setValue(data.item_id);
    }

    protected override afterSave(_data: FormData, rawData: ContactsEditDialogData): void
    {
        this.getDialogInstance().close(rawData); // we don't need the FormData here, we only need the raw data
    };
}
