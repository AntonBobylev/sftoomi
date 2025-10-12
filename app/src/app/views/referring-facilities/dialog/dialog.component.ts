import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';

import Sftoomi from '../../../class/Sftoomi';

import AppBaseEditDialog from '../../../components/core/app-base-edit-dialog/app-base-edit-dialog';

import AppTextfieldComponent from '../../../components/core/app-textfield/app-textfield.component';
import { AppItemSelectorDataListRow } from '../../../components/core/app-item-selector/data-list/data-list.component';
import AppItemSelectorComponent from '../../../components/core/app-item-selector/app-item-selector.component';

import { onlyLettersValidator } from '../../../validators/only-letters.validator';

import getFacilityAPI from '../../../APIs/getFacilityAPI';

import Doctor from '../../../type/Doctor';

export type ReferringFacilityEditDialogData = {
    id?: number
};

@Component({
    selector: 'referring-facility-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        FormsModule, ReactiveFormsModule,
        NzButtonComponent, NzModalFooterDirective,
        AppTextfieldComponent, AppItemSelectorComponent
    ],
    styleUrl: './dialog.component.scss'
})

export default class ReferringFacilityEditDialogComponent extends AppBaseEditDialog
{
    @ViewChild('doctorsItemSelectorCtrl')
    protected readonly doctorsItemSelectorCtrl!: AppItemSelectorComponent;

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
        let facilityDoctors: Doctor[] = [];

        if (this.data.id) {
            this.form.get('short_name')?.setValue(data.data.short_name);
            this.form.get('full_name')?.setValue(data.data.full_name);

            if (data.data.facility_doctors) {
                facilityDoctors = data.data.facility_doctors;
            }
        }

        let doctorsList: Doctor[] = data.lists.doctors;
        facilityDoctors.forEach(function (facilityDoctor: Doctor): void {
            doctorsList = doctorsList.filter(function (doctor: Doctor): boolean {
                return doctor.id !== facilityDoctor.id;
            });
        })

        this.doctorsItemSelectorCtrl.setData(
            this.convertDoctorsToItemSelectorRow(doctorsList),
            this.convertDoctorsToItemSelectorRow(facilityDoctors)
        );
    }

    protected override getAdditionalDataOnSave(data: FormData): FormData
    {
        let selectedDoctors: AppItemSelectorDataListRow[] = this.doctorsItemSelectorCtrl.getRightListData();
        if (selectedDoctors.length > 0) {
            let doctorsIds: string[] = selectedDoctors.map(function (doctor: AppItemSelectorDataListRow): string {
                return doctor.value;
            });

            data.append('facility_doctor_ids', doctorsIds.join(','));
        }

        return data;
    }

    private convertDoctorsToItemSelectorRow(doctors: Doctor[]): AppItemSelectorDataListRow[]
    {
        return doctors.map(function (row: Doctor): AppItemSelectorDataListRow {
            return {
                name:  Sftoomi.humanShortName(row),
                value: row.id.toString()
            };
        });
    }
}
