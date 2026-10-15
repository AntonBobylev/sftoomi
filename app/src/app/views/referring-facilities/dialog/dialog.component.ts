import { Component, inject, Signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';

import Sftoomi from '../../../class/Sftoomi';

import AppBaseEditDialog from '../../../components/core/app-base-edit-dialog/app-base-edit-dialog';

import AppTextFieldComponent from '../../../components/core/app-text-field/app-text-field.component';
import { AppItemSelectorDataListRow } from '../../../components/core/app-item-selector/data-list/data-list.component';
import AppItemSelectorComponent from '../../../components/core/app-item-selector/app-item-selector.component';

import { onlyLettersValidator } from '../../../validators/only-letters.validator';

import getFacilityAPI from '../../../APIs/getFacilityAPI';

import Doctor from '../../../interfaces/Doctor';

export interface ReferringFacilityEditDialogData {
    id?: number
}

@Component({
    selector: 'referring-facility-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        FormsModule, ReactiveFormsModule,
        NzButtonComponent, NzModalFooterDirective,
        AppTextFieldComponent, AppItemSelectorComponent
    ],
    styleUrls: [
        './dialog.component.less',
        '../../../components/core/app-base-edit-dialog/app-base-edit-dialog.less'
    ]
})

export default class ReferringFacilityEditDialogComponent extends AppBaseEditDialog
{
    protected override readonly data: ReferringFacilityEditDialogData = inject(NZ_MODAL_DATA);

    protected override readonly fetchExtraRequestOnLoad: boolean = true;

    protected override readonly loadUrl: string = '/getFacility';
    protected override readonly saveUrl: string = '/saveFacility';

    protected override readonly width: number | string | undefined = parseInt(Sftoomi.Translator.translate('views.referring_facilities.dialog.width'));

    protected override readonly addPermission: string | undefined = 'REFERRING_FACILITIES_MODULE::ADD';
    protected override readonly editPermission: string | undefined = 'REFERRING_FACILITIES_MODULE::EDIT';

    protected readonly form: FormGroup = new FormGroup({
        short_name: new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()]),
        full_name:  new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()])
    });

    private readonly doctorsItemSelectorCtrl: Signal<AppItemSelectorComponent> = viewChild.required('doctorsItemSelectorCtrl');

    protected afterLoad(data: getFacilityAPI): void
    {
        let facilityDoctors: Doctor[] = [];

        if (this.data.id) {
            this.form.get('short_name')?.setValue(data.data.short_name);
            this.form.get('full_name')?.setValue(data.data.full_name);

            if (data.data.facility_doctors) {
                facilityDoctors = data.data.facility_doctors;
            }
        }

        let doctorsList: Doctor[] = data.lists.doctors;
        facilityDoctors.forEach((facilityDoctor: Doctor): void => {
            doctorsList = doctorsList.filter((doctor: Doctor): boolean => doctor.id !== facilityDoctor.id);
        })

        this.doctorsItemSelectorCtrl().setData(
            this.convertDoctorsToItemSelectorRow(doctorsList),
            this.convertDoctorsToItemSelectorRow(facilityDoctors)
        );
    }

    protected override getAdditionalDataOnSave(data: FormData): FormData
    {
        const selectedDoctors: AppItemSelectorDataListRow[] = this.doctorsItemSelectorCtrl().getRightListData();
        if (selectedDoctors.length > 0) {
            const doctorsIds: string[] = selectedDoctors.map((doctor: AppItemSelectorDataListRow): string => doctor.value);

            data.append('facility_doctor_ids', doctorsIds.join(','));
        }

        return data;
    }

    private convertDoctorsToItemSelectorRow(doctors: Doctor[]): AppItemSelectorDataListRow[]
    {
        return doctors.map((row: Doctor): AppItemSelectorDataListRow => ({
            name:  Sftoomi.humanShortName(row),
            value: row.id.toString()
        }));
    }
}
