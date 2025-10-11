import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';

import AppBaseEditDialog from '../../../components/core/app-base-edit-dialog';

import AppTextfieldComponent from '../../../components/core/app-textfield/app-textfield.component';
import AppCheckboxComponent from '../../../components/fields/app-checkbox/app-checkbox.component';

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
        AppTextfieldComponent, AppCheckboxComponent
    ],
    styleUrl: './dialog.component.scss'
})

export default class UserEditDialogComponent extends AppBaseEditDialog
{
    protected override readonly data: UserEditDialogData = inject(NZ_MODAL_DATA);

    protected override readonly fetchExtraRequestOnLoad: boolean = true;

    protected readonly loadUrl: string = '/getUser';
    protected readonly saveUrl: string = '/saveUser';

    protected readonly form: FormGroup = new FormGroup({
        login:                    new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()]),
        reset_password:           new FormControl<boolean>(false),
        force_to_change_password: new FormControl<boolean>(false),
        last_name:                new FormControl<string | null>(null, [Validators.maxLength(255), onlyLettersValidator()]),
        first_name:               new FormControl<string | null>(null, [Validators.maxLength(255), onlyLettersValidator()]),
        disabled:                 new FormControl<boolean>(false)
    });

    protected afterLoad(data: getUserAPI): void
    {
        if (this.data.id) {
            this.form.get('login')?.setValue(data.data.login);
            this.form.get('reset_password')?.setValue(data.data.reset_password);
            this.form.get('force_to_change_password')?.setValue(data.data.force_to_change_password);
            this.form.get('first_name')?.setValue(data.data.first_name);
            this.form.get('last_name')?.setValue(data.data.last_name);
            this.form.get('disabled')?.setValue(data.data.disabled);
        }
    }

    protected override getAdditionalDataOnSave(data: FormData): FormData
    {
        return data;
    }
}
