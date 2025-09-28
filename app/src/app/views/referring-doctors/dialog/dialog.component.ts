import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';

import Sftoomi from '../../../class/Sftoomi';

import AppBaseEditDialog from '../../../components/core/app-base-edit-dialog';

import AppTextfieldComponent from '../../../components/core/app-textfield/app-textfield.component';
import AppItemSelectorComponent from '../../../components/core/app-item-selector/app-item-selector.component';
import { AppItemSelectorDataListRow } from '../../../components/core/app-item-selector/data-list/data-list.component';

import { onlyLettersValidator } from '../../../validators/only-letters.validator';

import getDoctorAPI from '../../../APIs/getDoctorAPI';

import Facility from '../../../type/Facility';

export type ReferringDoctorEditDialogData = {
    id?: number
};

@Component({
    selector: 'referring-doctor-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        FormsModule, ReactiveFormsModule,
        NzButtonComponent, NzModalFooterDirective, AppTextfieldComponent, AppItemSelectorComponent
    ],
    styleUrl: './dialog.component.scss'
})

export default class ReferringDoctorEditDialogComponent extends AppBaseEditDialog
{
    @ViewChild('facilitiesItemSelectorCtrl')
    protected readonly facilitiesItemSelectorCtrl!: AppItemSelectorComponent;

    protected override readonly data: ReferringDoctorEditDialogData = inject(NZ_MODAL_DATA);

    protected override readonly fetchExtraRequestOnLoad: boolean = true;

    protected readonly loadUrl: string = '/getDoctor';
    protected readonly saveUrl: string = '/saveDoctor';

    protected readonly form: FormGroup = new FormGroup({
        last_name:   new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()]),
        first_name:  new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()]),
        middle_name: new FormControl<string | null>(null, [Validators.maxLength(255), onlyLettersValidator()])
    });

    protected afterLoad(data: getDoctorAPI): void
    {
        let doctorFacilities: Facility[] = [];

        if (!Sftoomi.isEmpty(this.data.id)) {
            this.form.get('last_name')?.setValue(data.data.last_name);
            this.form.get('first_name')?.setValue(data.data.first_name);
            this.form.get('middle_name')?.setValue(data.data.middle_name);

            if (data.data.doctor_facilities) {
                doctorFacilities = data.data.doctor_facilities;
            }
        }

        let facilitiesList: Facility[] = data.lists.facilities;
        doctorFacilities.forEach(function (doctorFacility: Facility): void {
            facilitiesList = facilitiesList.filter(function (facility: Facility): boolean {
                return facility.id !== doctorFacility.id;
            });
        })

        this.facilitiesItemSelectorCtrl.setData(
            this.convertFacilitiesToItemSelectorRow(facilitiesList),
            this.convertFacilitiesToItemSelectorRow(doctorFacilities)
        );
    }

    protected isSaveButtonDisabled(): boolean
    {
        let selectedFacilities: AppItemSelectorDataListRow[] = this.facilitiesItemSelectorCtrl?.getRightListData();

        return this.form.invalid || selectedFacilities.length < 1;
    }

    protected override getAdditionalDataOnSave(data: FormData): FormData
    {
        let selectedFacilities: AppItemSelectorDataListRow[] = this.facilitiesItemSelectorCtrl.getRightListData();
        if (selectedFacilities.length > 0) {
            let facilitiesIds: string[] = selectedFacilities.map(function (facility: AppItemSelectorDataListRow): string {
                return facility.value;
            });

            data.append('doctor_facilities_ids', facilitiesIds.join(','));
        }

        return data;
    }

    private convertFacilitiesToItemSelectorRow(facilities: Facility[]): AppItemSelectorDataListRow[]
    {
        return facilities.map(function (row: Facility): AppItemSelectorDataListRow {
            return {
                name:    row.short_name,
                value:   row.id.toString(),
                tooltip: row.full_name
            };
        });
    }
}
