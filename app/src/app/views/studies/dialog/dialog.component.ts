import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';

import Sftoomi from '../../../class/Sftoomi';

import AppBaseEditDialog from '../../../components/core/app-base-edit-dialog';

import AppTextfieldComponent from '../../../components/core/app-textfield/app-textfield.component';

import getStudyAPI from '../../../APIs/getStudyAPI';

export type StudiesEditDialogData = {
    id?: number
};

@Component({
    selector: 'studies-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        FormsModule, ReactiveFormsModule,
        NzButtonComponent, NzModalFooterDirective,
        AppTextfieldComponent
    ],
    styleUrl: './dialog.component.scss'
})

export default class StudiesEditDialogComponent extends AppBaseEditDialog
{
    protected override readonly data: StudiesEditDialogData = inject(NZ_MODAL_DATA);

    protected override readonly fetchExtraRequestOnLoad: boolean = true;

    protected readonly loadUrl: string = '/getStudy';
    protected readonly saveUrl: string = '/saveStudy';

    protected readonly form: FormGroup = new FormGroup({
        short_name: new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required]),
        full_name:  new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required])
    });

    protected afterLoad(data: getStudyAPI): void
    {
        if (Sftoomi.isEmpty(data.data.id)) {
            return;
        }

        this.form.get('short_name')?.setValue(data.data.short_name);
        this.form.get('full_name')?.setValue(data.data.full_name);
    }
}
