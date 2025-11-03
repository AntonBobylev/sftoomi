import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzCollapseComponent, NzCollapsePanelComponent } from 'ng-zorro-antd/collapse';

import Sftoomi from '../../../class/Sftoomi'

import AppBaseEditDialog from '../../../components/core/app-base-edit-dialog/app-base-edit-dialog';

import AppTextfieldComponent from '../../../components/core/app-textfield/app-textfield.component';
import AppCheckboxComponent from '../../../components/fields/app-checkbox/app-checkbox.component';
import AppContactsComponent from '../../../components/fields/app-contacts/app-contacts.component';
import { AppContactsTableRecord } from '../../../components/fields/app-contacts/table/table.component'
import AppLoadingSpinnerComponent from '../../../components/misc/app-loading-spinner/app-loading-spinner.component'

import { onlyLettersValidator } from '../../../validators/only-letters.validator';

import getUserAPI from '../../../APIs/getUserAPI';

export type UserEditDialogData = {
    id?: number
};

@Component({
    selector: 'user-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        FormsModule, ReactiveFormsModule,
        NzButtonComponent, NzModalFooterDirective,
        AppTextfieldComponent, AppCheckboxComponent,
        NzCollapseComponent, NzCollapsePanelComponent,
        AppContactsComponent, AppLoadingSpinnerComponent
    ],
    styleUrls: [
        './dialog.component.less',
        '../../../components/core/app-base-edit-dialog/app-base-edit-dialog.less'
    ]
})

export default class UserEditDialogComponent extends AppBaseEditDialog
{
    protected override readonly data: UserEditDialogData = inject(NZ_MODAL_DATA);

    protected override readonly fetchExtraRequestOnLoad: boolean = true;

    protected override readonly loadUrl: string = '/getUser';
    protected override readonly saveUrl: string = '/saveUser';

    protected readonly form: FormGroup = new FormGroup({
        login:                    new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()]),
        reset_password:           new FormControl<boolean>(false),
        force_to_change_password: new FormControl<boolean>(false),
        last_name:                new FormControl<string | null>(null, [Validators.maxLength(255), onlyLettersValidator()]),
        first_name:               new FormControl<string | null>(null, [Validators.maxLength(255), onlyLettersValidator()]),
        disabled:                 new FormControl<boolean>(false)
    });

    protected override readonly width: string | number | undefined = 600;

    @ViewChild('contactsCtrl')
    private readonly contactsCtrl!: AppContactsComponent;

    private contactId: number | undefined;

    protected afterLoad(data: getUserAPI): void
    {
        if (this.data.id) {
            this.form.get('login')?.setValue(data.data.login);
            this.form.get('force_to_change_password')?.setValue(data.data.force_to_change_password);
            this.form.get('first_name')?.setValue(data.data.first_name);
            this.form.get('last_name')?.setValue(data.data.last_name);
            this.form.get('disabled')?.setValue(data.data.disabled);

            if (data.data.contacts) {
                this.contactsCtrl.setData(data.data.contacts.contacts);
                this.contactId = data.data.contacts.contact_id;
            }
        }
    }

    protected override getAdditionalDataOnSave(data: FormData): FormData
    {
        data.set('contacts', JSON.stringify({
            contact_id: this.contactId ?? '',
            contacts: this.contactsCtrl.getValue()
        }));

        return data;
    }

    protected override isPreValid(): boolean
    {
        if (Sftoomi.isEmpty(this.getEmailAddress())) {
            Sftoomi.popupMsgService?.error(Sftoomi.Translator.translate('fields.contacts.add_email_tip'));

            return false;
        }

        return true;
    }

    private getEmailAddress(): string | null
    {
        let userEmails: AppContactsTableRecord['text'][] = this.contactsCtrl.getValue()
            .filter((record: AppContactsTableRecord): boolean => record.type === 'email')
            .map((record: AppContactsTableRecord): AppContactsTableRecord['text'] => record.text);

        if (!Sftoomi.isEmpty(userEmails)) {
            return userEmails[0];
        }

        return null;
    }
}
