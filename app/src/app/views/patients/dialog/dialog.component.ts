import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import moment from 'moment';

import Sftoomi from '../../../class/Sftoomi';

import AppBaseEditDialog from '../../../components/core/app-base-edit-dialog';

import PatientDemographicsTemplateComponent from '../../../components/templates/patient-demographics-template/patient-demographics-template.component';

import getPatientAPI from '../../../APIs/getPatientAPI';

import { onlyLettersValidator } from '../../../validators/only-letters.validator';

export type PatientEditDialogData = {
    id?: number
};

@Component({
    selector: 'patient-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        FormsModule, ReactiveFormsModule,
        PatientDemographicsTemplateComponent,
        NzButtonComponent, NzModalFooterDirective
    ],
    styleUrl: './dialog.component.scss'
})

export default class PatientEditDialogComponent extends AppBaseEditDialog
{
    protected override readonly data: PatientEditDialogData = inject(NZ_MODAL_DATA);

    protected override readonly fetchExtraRequestOnLoad: boolean = true;

    protected readonly loadUrl: string = '/getPatient';
    protected readonly saveUrl: string = '/savePatient';

    protected readonly form: FormGroup = new FormGroup({
        last_name:   new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()]),
        first_name:  new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()]),
        middle_name: new FormControl<string | null>(null, [Validators.maxLength(255), onlyLettersValidator()]),
        dob:         new FormControl<Date   | null>(null),
        phone:       new FormControl<string | null>(null, [Validators.maxLength(16)])
    });

    protected afterLoad(data: getPatientAPI): void
    {
        if (this.data.id) {
            this.form.get('first_name')?.setValue(data.data.first_name.toUpperCase());
            this.form.get('last_name')?.setValue(data.data.last_name.toUpperCase());
            this.form.get('middle_name')?.setValue(data.data.middle_name?.toUpperCase());
            this.form.get('phone')?.setValue(data.data.phone);

            if (data.data.dob) {
                this.form.get('dob')?.setValue(moment(data.data.dob).toDate());
            }
        }
    }

    protected override getAdditionalDataOnSave(data: FormData): FormData
    {
        data.set('dob', Sftoomi.dateShort(this.form.get('dob')?.value));

        return data;
    }
}
