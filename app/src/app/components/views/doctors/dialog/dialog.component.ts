import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiDialogContext, TuiError, TuiLabel, TuiLoader, TuiTextfieldComponent, TuiTextfieldDirective } from '@taiga-ui/core';
import { TuiFieldErrorPipe, TuiTab, TuiTabsHorizontal } from '@taiga-ui/kit';
import { injectContext } from '@taiga-ui/polymorpheus';

import AppBaseEditDialog from '../../../core/app-base-edit-dialog';

import getDoctorAPI from '../../../../APIs/getDoctorAPI';

import AppItemSelectorComponent from '../../../fields/app-item-selector/app-item-selector.component';
import { AppItemSelectorDataListRow } from '../../../fields/app-item-selector/data-list/data-list.component';

import { onlyLettersValidator } from '../../../../validators/only-letters.validator';

import OnlyLettersDirective from '../../../../directives/only-letters.directive';
import UppercaseDirective from '../../../../directives/uppercase.directive';

import Facility from '../../../../type/Facility';

export type DoctorEditDialogData = {
    id?: number
};

@Component({
    selector: 'doctor-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        AsyncPipe, OnlyLettersDirective, ReactiveFormsModule,
        TuiButton, TuiError, TuiFieldErrorPipe, TuiLabel,
        TuiLoader, TuiTextfieldComponent, TuiTextfieldDirective,
        TuiTabsHorizontal, TuiTab, AppItemSelectorComponent, UppercaseDirective
    ],
    styleUrl: './dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export default class DoctorEditDialogComponent extends AppBaseEditDialog
{
    protected readonly context: TuiDialogContext<any, DoctorEditDialogData> = injectContext<TuiDialogContext<any, DoctorEditDialogData>>();

    @ViewChild('facilitiesItemSelectorCtrl')
    protected readonly facilitiesItemSelectorCtrl!: AppItemSelectorComponent;

    protected readonly loadUrl: string = '/getDoctor';
    protected readonly saveUrl: string = '/saveDoctor';

    protected override readonly fetchExtraRequestOnLoad: boolean = true;

    protected readonly form: FormGroup = new FormGroup({
        last_name:   new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()]),
        first_name:  new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()]),
        middle_name: new FormControl<string | null>(null, [Validators.maxLength(255), onlyLettersValidator()])
    });

    protected activeTabIndex: number = 0;

    protected afterLoad(data: getDoctorAPI): void
    {
        let doctorFacilities: Facility[] = [];

        if (this.data.id) {
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

    protected override getAdditionalDataOnSave(data: FormData): FormData
    {
        let selectedFacilities: AppItemSelectorDataListRow[] = this.facilitiesItemSelectorCtrl.getRightListData();
        if (selectedFacilities.length > 0) {
            let facilitiesIds: string[] = selectedFacilities.map(function (facility:  AppItemSelectorDataListRow): string {
                return facility.value;
            });

            data.append('doctor_facilities_ids', facilitiesIds.join(','));
        }

        return data;
    }

    protected isSaveButtonDisabled(): boolean
    {
        let selectedFacilities: AppItemSelectorDataListRow[] = this.facilitiesItemSelectorCtrl?.getRightListData();

        return this.form.invalid || selectedFacilities.length < 1;
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
