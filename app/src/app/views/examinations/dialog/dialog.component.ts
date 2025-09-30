import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';

import Sftoomi from '../../../class/Sftoomi';

import AppBaseEditDialog from '../../../components/core/app-base-edit-dialog';
import AppDatepickerComponent from '../../../components/core/app-datepicker/app-datepicker.component';
import AppComboComponent, { AppComboRecord } from '../../../components/core/app-combo/app-combo.component';

import getExaminationAPI from '../../../APIs/getExaminationAPI';

export type ExaminationEditDialogData = {
    id?: number
};

@Component({
    selector: 'examination-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        FormsModule, ReactiveFormsModule,
        NzButtonComponent, NzModalFooterDirective,
        AppDatepickerComponent, AppComboComponent
    ],
    styleUrl: './dialog.component.less'
})

export default class ExaminationEditDialogComponent extends AppBaseEditDialog
{
    @ViewChild('facilityCtrl')
    protected readonly facilityCtrl!: AppComboComponent;

    @ViewChild('doctorCtrl')
    protected readonly doctorCtrl!: AppComboComponent;

    protected override readonly data: ExaminationEditDialogData = inject(NZ_MODAL_DATA);

    protected override readonly fetchExtraRequestOnLoad: boolean = true;

    protected readonly loadUrl: string = '/getExamination';
    protected readonly saveUrl: string = '/saveExamination';

    protected readonly form: FormGroup = new FormGroup({
        date:        new FormControl<Date           | null>(null, [Validators.required]),
        facility_id: new FormControl<AppComboRecord | null>(null, [Validators.required]),
        doctor_id:   new FormControl<AppComboRecord | null>(null)
    });

    protected afterLoad(data: getExaminationAPI): void
    {
        this.facilityCtrl.setData(data.lists.facilities.map((facility): AppComboRecord => {
            return {
                caption: facility.short_name,
                value:   facility.id
            }
        }));

        this.doctorCtrl.setData(data.lists.doctors.map((doctor): AppComboRecord => {
            return {
                caption: Sftoomi.humanShortName(doctor),
                value:   doctor.id
            }
        }));

        if (!data.data) {
            return;
        }

        this.form.get('date')?.setValue(Sftoomi.stringToDate(data.data.date));
        this.form.get('facility_id')?.setValue(data.data.facility_id);
        this.form.get('doctor_id')?.setValue(data.data.doctor_id);
    }
}
