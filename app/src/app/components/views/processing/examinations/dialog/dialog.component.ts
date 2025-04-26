import { ChangeDetectionStrategy, Component, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiDialogContext, TuiLoader, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { TuiComboBoxModule, TuiInputDateModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import moment from 'moment/moment';

import Sftoomi from '../../../../../class/Sftoomi';

import AppBaseEditDialog from '../../../../core/app-base-edit-dialog';
import Fetcher from '../../../../../class/Fetcher';

import PatientDemographicsTemplateComponent, { PatientDemographicsTemplateControls } from '../../../../templates/patient-demographics-template.component';
import AppRemoteSelectComponent, { AppRemoteSelectRecord } from '../../../../fields/app-remote-select/app-remote-select.component';
import AppComboBoxComponent, { AppComboboxRecord } from '../../../../fields/app-combo-box/app-combo-box.component';

import getPatientAPI from '../../../../../APIs/getPatientAPI';
import getExaminationAPI from '../../../../../APIs/getExaminationAPI';

export type ExaminationEditDialogData = {
    id: number
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
        AppComboBoxComponent
    ],
    styleUrl: './dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export default class ExaminationEditDialogComponent extends AppBaseEditDialog implements OnInit
{
    protected readonly context: TuiDialogContext<any, ExaminationEditDialogData> = injectContext<TuiDialogContext<any, ExaminationEditDialogData>>();

    protected override readonly fetchExtraRequestOnLoad: boolean = true;

    @ViewChild('facilityIdCtrl')
    protected readonly facilityIdCtrl!: AppComboBoxComponent;

    @ViewChild('doctorIdCtrl')
    protected readonly doctorIdCtrl!: AppComboBoxComponent;

    protected readonly loadUrl: string = '/getExamination';
    protected readonly saveUrl: string = '//TODO:implementMe';
    private readonly getPatientUrl: string = '/getPatient';

    protected readonly form: FormGroup = new FormGroup({
        // Patient
        patient_id:          new FormControl(null, [Validators.min(1)]),
        patient_last_name:   new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]),
        patient_first_name:  new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]),
        patient_middle_name: new FormControl('', [Validators.minLength(2), Validators.maxLength(255)]),
        patient_dob:         new FormControl,
        patient_phone:       new FormControl('', [Validators.minLength(16), Validators.maxLength(16)]),

        // Staff
        facility_id: new FormControl<string | null>(null, [Validators.required]),
        doctor_id:   new FormControl<string | null>(null)
    });

    protected readonly facilitiesStore: WritableSignal<AppComboboxRecord[]> = signal<AppComboboxRecord[]>([]);
    protected readonly doctorsStore: WritableSignal<AppComboboxRecord[]> = signal<AppComboboxRecord[]>([]);

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

        this.lists = data.lists;
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

    protected onPatientSelected(event: AppRemoteSelectRecord | null): void
    {
        if (!event) {
            return;
        }

        let me: this = this,
            data: FormData = new FormData();

        data.append('id', event.id.toString());

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
}
