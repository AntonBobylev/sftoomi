import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';

import Sftoomi from '../../../class/Sftoomi';
import Fetcher from '../../../class/Fetcher';
import { DialogType } from '../../../class/Dialog';

import AppBaseEditDialog from '../../../components/core/app-base-edit-dialog';
import AppDatepickerComponent from '../../../components/core/app-datepicker/app-datepicker.component';
import AppComboComponent, { AppComboRecord } from '../../../components/core/app-combo/app-combo.component';
import PatientDemographicsTemplateComponent from '../../../components/templates/patient-demographics-template/patient-demographics-template.component';

import getPatientAPI from '../../../APIs/getPatientAPI';
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
        AppDatepickerComponent, AppComboComponent,
        PatientDemographicsTemplateComponent
    ],
    styleUrl: './dialog.component.less'
})

export default class ExaminationEditDialogComponent extends AppBaseEditDialog
{
    @ViewChild('patientIdCtrl')
    protected readonly patientIdCtrl!: AppComboComponent;

    @ViewChild('facilityCtrl')
    protected readonly facilityCtrl!: AppComboComponent;

    @ViewChild('doctorCtrl')
    protected readonly doctorCtrl!: AppComboComponent;

    protected override readonly data: ExaminationEditDialogData = inject(NZ_MODAL_DATA);

    protected override readonly fetchExtraRequestOnLoad: boolean = true;

    protected readonly getPatientUrl: string = '/getPatient';
    protected readonly loadUrl: string = '/getExamination';
    protected readonly saveUrl: string = '/saveExamination';

    protected readonly form: FormGroup = new FormGroup({
        date:                new FormControl<Date           | null>(null, [Validators.required]),
        patient_id:          new FormControl<AppComboRecord | null>(null),
        facility_id:         new FormControl<AppComboRecord | null>(null, [Validators.required]),
        doctor_id:           new FormControl<AppComboRecord | null>(null),
        patient_last_name:   new FormControl<string | null>(null,[Validators.required]),
        patient_first_name:  new FormControl<string | null>(null,[Validators.required]),
        patient_middle_name: new FormControl<string | null>(null),
        patient_dob:         new FormControl<string | null>(null),
        patient_phone:       new FormControl<string | null>(null)
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

        if (Sftoomi.isEmpty(data.data)) {
            return;
        }

        this.form.get('date')?.setValue(Sftoomi.stringToDate(data.data.date));
        this.form.get('facility_id')?.setValue(data.data.facility_id);
        this.form.get('doctor_id')?.setValue(data.data.doctor_id);

        this.patientIdCtrl.setData([{
            caption: Sftoomi.format('{0} (#{1})', [Sftoomi.humanShortName(data.data.patient), data.data.patient.id.toString()]),
            value:   data.data.patient.id
        }]);

        this.form.get('patient_id')?.setValue(data.data.patient_id);
    }

    protected onPatientSelected(patientId: AppComboRecord['value']): void
    {
        if (Sftoomi.isEmpty(patientId)) {
            return;
        }

        let data: FormData = new FormData();
        data.append('id', patientId.toString());

        new Fetcher().request({
            url: this.getPatientUrl,
            data: data,
            success: (_response: any, _request: any, data: getPatientAPI): void => {
                if (Sftoomi.isEmpty(data.data)) {
                    return;
                }

                this.form.get('patient_last_name')?.setValue(data.data.last_name);
                this.form.get('patient_first_name')?.setValue(data.data.first_name);
                this.form.get('patient_middle_name')?.setValue(data.data.middle_name);
                this.form.get('patient_dob')?.setValue(data.data.dob);
                this.form.get('patient_phone')?.setValue(data.data.phone);
            },
            failure: (_code: any, message: any, _request: any): void => {
                Sftoomi.Dialog.show(message, DialogType.ERROR)
            },
            finally: (): void => {
                this.isLoading.set(false);
            }
        })
    }
}
