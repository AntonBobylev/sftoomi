import { ChangeDetectionStrategy, Component, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { TuiButton, TuiDialogContext, TuiError, TuiLoader, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { TuiComboBoxModule, TuiInputDateModule, TuiTextfieldControllerModule, TuiUnfinishedValidator } from '@taiga-ui/legacy';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import moment from 'moment/moment';

import Sftoomi from '../../../../../class/Sftoomi';

import AppBaseEditDialog from '../../../../core/app-base-edit-dialog';
import Fetcher from '../../../../../class/Fetcher';

import PatientDemographicsTemplateComponent, { PatientDemographicsTemplateControls } from '../../../../templates/patient-demographics-template.component';
import AppRemoteSelectComponent, { AppRemoteSelectRecord } from '../../../../fields/app-remote-select/app-remote-select.component';
import AppComboBoxComponent, { AppComboboxRecord } from '../../../../fields/app-combo-box/app-combo-box.component';
import AppStudiesComponent from '../../../../fields/app-studies/app-studies.component';

import getPatientAPI from '../../../../../APIs/getPatientAPI';
import getExaminationAPI from '../../../../../APIs/getExaminationAPI';

import TuiDateToNativeTransformerDirective from '../../../../../directives/tui-date-to-native.directive';

import Study from '../../../../../type/Study';

export type ExaminationEditDialogData = {
    id?: number,
    date?: string
};

@Component({
    selector: 'examination-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        ReactiveFormsModule, TuiButton,
        TuiLoader, TuiInputDateModule,
        PatientDemographicsTemplateComponent,
        AppRemoteSelectComponent, TuiCardLarge,
        TuiTitle, TuiHeader, TuiSurface,
        TuiComboBoxModule, TuiTextfieldControllerModule,
        AppComboBoxComponent, AppStudiesComponent, AsyncPipe,
        TuiDateToNativeTransformerDirective, TuiError,
        TuiFieldErrorPipe, TuiUnfinishedValidator
    ],
    styleUrl: './dialog.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export default class ExaminationEditDialogComponent extends AppBaseEditDialog implements OnInit
{
    protected readonly context: TuiDialogContext<any, ExaminationEditDialogData> = injectContext<TuiDialogContext<any, ExaminationEditDialogData>>();

    protected override readonly fetchExtraRequestOnLoad: boolean = true;

    protected override readonly idField: string = 'examination_id';

    @ViewChild('facilityIdCtrl')
    protected readonly facilityIdCtrl!: AppComboBoxComponent;

    @ViewChild('doctorIdCtrl')
    protected readonly doctorIdCtrl!: AppComboBoxComponent;

    @ViewChild('studiesCtrl')
    protected readonly studiesCtrl!: AppStudiesComponent;

    protected readonly loadUrl: string = '/getExamination';
    protected readonly saveUrl: string = '/saveExamination';
    private readonly getPatientUrl: string = '/getPatient';

    protected readonly form: FormGroup = new FormGroup({
        // Examination
        examination_date:    new FormControl(null, [Validators.required]),

        // Patient
        patient_id:          new FormControl(null, [Validators.min(1)]),
        patient_last_name:   new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]),
        patient_first_name:  new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]),
        patient_middle_name: new FormControl('', [Validators.minLength(2), Validators.maxLength(255)]),
        patient_dob:         new FormControl,
        patient_phone:       new FormControl('', [Validators.minLength(16), Validators.maxLength(16)]),

        // Staff
        facility_id: new FormControl<string | null>(null, [Validators.required]),
        doctor_id:   new FormControl<string | null>(null),
    });

    protected readonly facilitiesStore: WritableSignal<AppComboboxRecord[]> = signal<AppComboboxRecord[]>([]);
    protected readonly doctorsStore: WritableSignal<AppComboboxRecord[]> = signal<AppComboboxRecord[]>([]);
    protected readonly studiesStore: WritableSignal<AppComboboxRecord[]> = signal<AppComboboxRecord[]>([]);

    private lists: getExaminationAPI['lists'] | undefined;

    ngOnInit(): void
    {
        let me: this = this;
        this.form.get('facility_id')?.valueChanges.subscribe((selectedFacilityId): void => me.onFacilitySelected(selectedFacilityId));
        this.form.get('doctor_id')?.valueChanges.subscribe((selectedDoctorId): void => me.onDoctorSelected(selectedDoctorId));
    }

    protected afterLoad(data: getExaminationAPI): void
    {
        this.facilitiesStore.set(data.lists.facilities.map(function (facility): AppComboboxRecord {
            return {
                value: facility.id,
                title: facility.short_name
            };
        }));

        this.doctorsStore.set(data.lists.doctors.map(function (doctor): AppComboboxRecord {
            return {
                value: doctor.id,
                title: Sftoomi.humanShortName(doctor)
            };
        }));

        this.studiesStore.set(data.lists.studies.map(function (study: Study): AppComboboxRecord {
            return {
                value: study.id,
                title: study.short_name
            };
        }));

        this.lists = data.lists;

        if (data.data.id) {
            this.form.get('examination_date')?.setValue(moment(data.data.date).toDate());
            this.form.get('patient_id')?.setValue(data.data.patient_id);

            this.form.get('facility_id')?.setValue(data.data.facility_id);
            this.form.get('doctor_id')?.setValue(data.data.doctor_id ?? null);

            this.studiesCtrl.setValue(data.data.studies);
        }
    }

    protected getPatientTemplateControls(): PatientDemographicsTemplateControls
    {
        return {
            last_name:   this.form.get('patient_last_name') as FormControl,
            first_name:  this.form.get('patient_first_name') as FormControl,
            middle_name: this.form.get('patient_middle_name') as FormControl,
            dob:         this.form.get('patient_dob') as FormControl,
            phone:       this.form.get('patient_phone') as FormControl
        }
    }

    protected onPatientSelected(event: number | AppRemoteSelectRecord | null): void
    {
        if (!event) {
            return;
        }

        let me: this = this,
            data: FormData = new FormData(),
            id: string;

        if (typeof event === 'number') {
            id = event.toString();
        } else {
            id = event.id.toString();
        }

        data.append('id', id);

        me.isLoading.set(true);
        new Fetcher().request({
            url: this.getPatientUrl,
            data: data,
            success: function (_response: any, _request: any, data: getPatientAPI): void {
                me.isLoading.set(false);

                if (Sftoomi.isEmpty(data.data)) {
                    return;
                }

                me.form.get('patient_first_name')?.setValue(data.data.first_name.toUpperCase());
                me.form.get('patient_last_name')?.setValue(data.data.last_name.toUpperCase());
                me.form.get('patient_middle_name')?.setValue(data.data.middle_name.toUpperCase());
                me.form.get('patient_phone')?.setValue(data.data.phone);

                if (data.data.dob) {
                    me.form.get('patient_dob')?.setValue(moment(data.data.dob).toDate());
                }
            },
            failure: function (code: any, message: any, _request: any): void {
                me.isLoading.set(false);

                if (message === 'canceled') {
                    return;
                }

                console.error(code);
                console.error(message);
            }
        });
    }

    protected override getAdditionalDataOnSave(data: FormData): FormData
    {
        let selectedPatientId: AppRemoteSelectRecord | null = this.form.get('patient_id')?.value as (AppRemoteSelectRecord | null);
        data.set('patient_id', selectedPatientId?.id.toString() ?? '');

        let selectedStudies: FormControl[] = this.studiesCtrl.getAddedStudiesControls(),
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

    private onFacilitySelected(selectedFacilityId: string | null): void
    {
        if (!this.lists) {
            return;
        }

        let facility = this.lists.facilities.find(function (record): boolean {
            return record.id.toString() === selectedFacilityId;
        });

        this.doctorIdCtrl.updateFilters(facility);
    }

    private onDoctorSelected(selectedDoctorId: string | null): void
    {
        if (!this.lists) {
            return;
        }

        let doctor = this.lists.doctors.find(function (record): boolean {
            return record.id.toString() === selectedDoctorId;
        });

        this.facilityIdCtrl.updateFilters(doctor);
    }

    protected filterFacilities(currentFacilityId: string, selectedDoctor: any | undefined): boolean
    {
        if (!selectedDoctor) {
            return true;
        }

        let selectedDoctorFacilities: string[] = selectedDoctor.facilities.split(',');

        return selectedDoctorFacilities.includes(currentFacilityId);
    }

    protected filterDoctors(currentDoctorId: string, selectedFacility: any | undefined): boolean
    {
        if (!selectedFacility) {
            return true;
        }

        let selectedFacilityDoctors: string[] = selectedFacility.doctors.split(',');

        return selectedFacilityDoctors.includes(currentDoctorId);
    }

    protected override isPreValid(): boolean
    {
        let addedStudiesCount: number = this.studiesCtrl.getAddedStudiesCount();
        if (addedStudiesCount < 1) {
            this.popupMsg.warning(Sftoomi.Translator.translate('views.processing.dialog.no_studies_added_tip'));

            return false;
        }

        return true;
    }
}
