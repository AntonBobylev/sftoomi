import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';

import Sftoomi from '../../../class/Sftoomi';

import AppBaseEditDialog from '../../../components/core/app-base-edit-dialog';

import AppTextfieldComponent from '../../../components/core/app-textfield/app-textfield.component';

import { onlyLettersValidator } from '../../../validators/only-letters.validator';

import getDoctorAPI from '../../../APIs/getDoctorAPI';

export type ReferringDoctorEditDialogData = {
    id?: number
};

@Component({
    selector: 'referring-doctor-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        FormsModule, ReactiveFormsModule,
        NzButtonComponent, NzModalFooterDirective, AppTextfieldComponent
    ],
    styleUrl: './dialog.component.scss'
})

export default class ReferringDoctorEditDialogComponent extends AppBaseEditDialog
{
    protected override readonly data: ReferringDoctorEditDialogData = inject(NZ_MODAL_DATA);

    protected override readonly fetchExtraRequestOnLoad: boolean = true;

    protected readonly loadUrl: string = '/getDoctor';
    protected readonly saveUrl: string = '/saveDoctor';

    protected readonly form: FormGroup = new FormGroup({
        last_name:   new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()]),
        first_name:  new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()]),
        middle_name: new FormControl<string | null>(null, [Validators.maxLength(255), onlyLettersValidator()])
    });

    protected afterLoad(data: getDoctorAPI): void
    {
        if (Sftoomi.isEmpty(this.data.id)) {
            return;
        }

        this.form.get('last_name')?.setValue(data.data.last_name);
        this.form.get('first_name')?.setValue(data.data.first_name);
        this.form.get('middle_name')?.setValue(data.data.middle_name);
    }
}
