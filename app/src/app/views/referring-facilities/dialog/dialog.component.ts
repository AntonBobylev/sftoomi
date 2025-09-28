import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';

import Sftoomi from '../../../class/Sftoomi';

import AppBaseEditDialog from '../../../components/core/app-base-edit-dialog';

import { onlyLettersValidator } from '../../../validators/only-letters.validator';

import getFacilityAPI from '../../../APIs/getFacilityAPI';
import AppTextfieldComponent from '../../../components/core/app-textfield/app-textfield.component';

export type ReferringFacilityEditDialogData = {
    id?: number
};

@Component({
    selector: 'referring-facility-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        FormsModule, ReactiveFormsModule,
        NzButtonComponent, NzModalFooterDirective, AppTextfieldComponent
    ],
    styleUrl: './dialog.component.scss'
})

export default class ReferringFacilityEditDialogComponent extends AppBaseEditDialog
{
    protected override readonly data: ReferringFacilityEditDialogData = inject(NZ_MODAL_DATA);

    protected override readonly fetchExtraRequestOnLoad: boolean = true;

    protected readonly loadUrl: string = '/getFacility';
    protected readonly saveUrl: string = '/saveFacility';

    protected readonly form: FormGroup = new FormGroup({
        short_name: new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()]),
        full_name:  new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()])
    });

    protected afterLoad(data: getFacilityAPI): void
    {
        if (Sftoomi.isEmpty(this.data.id)) {
            return;
        }

        this.form.get('short_name')?.setValue(data.data.short_name);
        this.form.get('full_name')?.setValue(data.data.full_name);
    }
}
