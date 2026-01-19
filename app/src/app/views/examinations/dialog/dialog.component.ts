import { Component, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';

import Sftoomi from '../../../class/Sftoomi';
import Fetcher from '../../../class/Fetcher';
import { DialogType } from '../../../class/Dialog';

import AppBaseEditDialog from '../../../components/core/app-base-edit-dialog/app-base-edit-dialog';
import AppDatepickerComponent from '../../../components/core/app-datepicker/app-datepicker.component';
import AppComboComponent, { AppComboRecord } from '../../../components/core/app-combo/app-combo.component';
import PatientDemographicsTemplateComponent from '../../../components/templates/patient-demographics-template/patient-demographics-template.component';
import AppStudiesSelectorComponent from '../../../components/fields/app-studies-selector/app-studies-selector.component';

import phoneValidator from '../../../validators/phone.validator';

import getPatientAPI from '../../../APIs/getPatientAPI';
import getExaminationAPI from '../../../APIs/getExaminationAPI';

export type ExaminationEditDialogData = {
    id?: number,
    examination_date?: Date
};

@Component({
    selector: 'examination-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        FormsModule, ReactiveFormsModule,
        NzButtonComponent, NzModalFooterDirective,
        AppDatepickerComponent, AppComboComponent,
        PatientDemographicsTemplateComponent, AppStudiesSelectorComponent
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

    @ViewChild('studiesSelectorCtrl')
    protected readonly studiesSelectorCtrl!: AppStudiesSelectorComponent;

    protected override readonly data: ExaminationEditDialogData = inject(NZ_MODAL_DATA);

    protected override readonly fetchExtraRequestOnLoad: boolean = true;

    protected readonly getPatientUrl: string = '/getPatient';
    protected override readonly loadUrl: string = '/getExamination';
    protected override readonly saveUrl: string = '/saveExamination';

    protected override readonly addPermission: string | undefined = 'EXAMINATIONS_MODULE::ADD';
    protected override readonly editPermission: string | undefined = 'EXAMINATIONS_MODULE::EDIT';

    protected override readonly idField: string = 'examination_id';

    protected override readonly width: number | string | undefined = 800;

    protected readonly form: FormGroup = new FormGroup({
        examination_date:    new FormControl<Date           | null>(null, [Validators.required]),
        patient_id:          new FormControl<AppComboRecord | null>(null),
        facility_id:         new FormControl<AppComboRecord | null>(null, [Validators.required]),
        doctor_id:           new FormControl<AppComboRecord | null>(null),
        patient_last_name:   new FormControl<string | null>(null, [Validators.required]),
        patient_first_name:  new FormControl<string | null>(null, [Validators.required]),
        patient_middle_name: new FormControl<string | null>(null),
        patient_dob:         new FormControl<Date   | null>(null),
        patient_phone:       new FormControl<string | null>(null, [phoneValidator()]),
        studies:             new FormControl
    });

    protected readonly studiesStore: WritableSignal<AppComboRecord[]> = signal<AppComboRecord[]>([]);

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

        this.studiesStore.set(data.lists.studies.map((study): AppComboRecord => {
            return {
                caption: study.short_name,
                value:   study.id
            }
        }));

        if (Sftoomi.isEmpty(data.data)) {
            this.form.get('examination_date')?.setValue(this.data.examination_date ?? new Date());

            return;
        }

        this.form.get('examination_date')?.setValue(Sftoomi.stringToDate(data.data.date));
        this.form.get('facility_id')?.setValue(data.data.facility_id);
        this.form.get('doctor_id')?.setValue(data.data.doctor_id);

        this.patientIdCtrl.setData([{
            caption: Sftoomi.format('{0} (#{1})', [Sftoomi.humanShortName(data.data.patient), data.data.patient.id.toString()]),
            value:   data.data.patient.id
        }]);

        this.form.get('patient_id')?.setValue(data.data.patient_id);
        this.studiesSelectorCtrl.setValue(data.data.studies);
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
                this.form.get('patient_dob')?.setValue(Sftoomi.stringToDate(data.data.dob));
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

    protected override getAdditionalDataOnSave(data: FormData): FormData
    {
        let selectedStudies: FormControl[] = this.studiesSelectorCtrl.getAddedStudiesControls(),
            addedStudiesIds: number[] = [];

        selectedStudies.forEach(function (studyControl: FormControl): void {
            let controlName: string | undefined = Sftoomi.getFormControlName(studyControl);

            for (let [key] of data.entries()) {
                if (key === controlName) {
                    addedStudiesIds.push(studyControl.value);
                    data.delete(key);
                }
            }
        });

        data.set('study_ids', addedStudiesIds.join(','));

        return data;
    }

    protected override isPreValid(): boolean
    {
        let addedStudiesCount: number = this.studiesSelectorCtrl.getAddedStudiesCount();
        if (addedStudiesCount < 1) {
            Sftoomi.popupMsgService?.warning(Sftoomi.Translator.translate('views.examinations.dialog.no_studies_added_tip'));

            return false;
        }

        return true;
    }
}
