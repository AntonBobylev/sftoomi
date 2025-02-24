import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiDialogContext, TuiError, TuiLabel, TuiLoader, TuiTextfieldComponent, TuiTextfieldDirective } from '@taiga-ui/core';
import { TuiFieldErrorPipe, TuiTab, TuiTabsHorizontal } from '@taiga-ui/kit';
import { injectContext } from '@taiga-ui/polymorpheus';

import AppBaseEditDialogWithTabs from '../../../core/app-base-edit-dialog-with-tabs';

import getFacilityAPI from '../../../../APIs/getFacilityAPI';

import { onlyLettersValidator } from '../../../../validators/only-letters.validator';

import OnlyLettersDirective from '../../../../directives/only-letters.directive';
import AppItemSelectorComponent from '../../../fields/app-item-selector/app-item-selector.component';
import Facility from '../../../../type/Facility';
import { AppItemSelectorDataListRow } from '../../../fields/app-item-selector/data-list/data-list.component';
import Doctor from '../../../../type/Doctor';

export type FacilityEditDialogData = {
    id?: number
};

@Component({
    selector: 'facility-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        AsyncPipe, OnlyLettersDirective, ReactiveFormsModule,
        TuiButton, TuiError, TuiFieldErrorPipe, TuiLabel,
        TuiLoader, TuiTextfieldComponent, TuiTextfieldDirective, TuiTab, TuiTabsHorizontal, AppItemSelectorComponent
    ],
    styleUrls: [
        './dialog.component.scss',
        '../../../core/app-base-edit-dialog-with-tabs.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export default class FacilityEditDialogComponent extends AppBaseEditDialogWithTabs
{
    protected readonly context: TuiDialogContext<any, FacilityEditDialogData> = injectContext<TuiDialogContext<any, FacilityEditDialogData>>();

    @ViewChild('doctorsItemSelectorCtrl')
    protected readonly doctorsItemSelectorCtrl!: AppItemSelectorComponent;

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
                name:    row.last_name,
                value:   row.id.toString()
            };
        });
    }
}
