import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonComponent } from 'ng-zorro-antd/button'
import { NzIconDirective } from 'ng-zorro-antd/icon'
import { NzCardComponent } from 'ng-zorro-antd/card'

import Sftoomi from '../../../class/Sftoomi';

import AppBaseFilters from '../../../components/core/app-base-filters';

import AppNumberfieldComponent from '../../../components/core/app-numberfield/app-numberfield.component'
import AppDatepickerComponent from '../../../components/core/app-datepicker/app-datepicker.component'
import AppLoadingSpinnerComponent from '../../../components/misc/app-loading-spinner/app-loading-spinner.component'

import getExaminationsFiltersAPI from '../../../APIs/getExaminationsFiltersAPI';

export type ExaminationsFiltersPanelIn = {
    examination_date: Date,
    examination_id:   number | null
};

export type ExaminationsFiltersPanelOut = {
    examination_date: Date,
    examination_id:   number | null
};

export type ExaminationsFiltersPanelClearEventData = ExaminationsFiltersPanelOut & {
    doSearch: boolean
};

@Component({
    selector: 'examinations-module-filters-panel',
    templateUrl: './filters.component.html',
    imports: [
        ReactiveFormsModule, AppNumberfieldComponent, NzButtonComponent,
        NzIconDirective, NzCardComponent, AppDatepickerComponent, AppLoadingSpinnerComponent
    ],
    styleUrl: './filters.component.less'
})

export default class ExaminationsFiltersComponent extends AppBaseFilters
{
    @ViewChild('examinationDatePickerCtrl')
    protected readonly examinationDatePickerCtrl!: AppDatepickerComponent;

    @Output() public onSearch: EventEmitter<ExaminationsFiltersPanelOut> = new EventEmitter<ExaminationsFiltersPanelOut>();
    @Output() public onClear:  EventEmitter<ExaminationsFiltersPanelClearEventData> = new EventEmitter<ExaminationsFiltersPanelClearEventData>();
    @Output() public onLoaded: EventEmitter<ExaminationsFiltersPanelOut> = new EventEmitter<ExaminationsFiltersPanelOut>();

    protected readonly form: FormGroup = new FormGroup({
        examination_date: new FormControl<Date   | null>(null, [Validators.required]),
        examination_id:   new FormControl<number | null>(null, [Validators.min(1), Validators.max(Sftoomi.Constants.types.int.unsigned)])
    });

    protected override readonly loadUrl: string = '/getExaminationsFilters';

    public getValues(): ExaminationsFiltersPanelOut
    {
        return {
            examination_date: this.form.get('examination_date')?.value,
            examination_id:   this.form.get('examination_id')?.value ?? ''
        };
    }

    public override setValues(values: ExaminationsFiltersPanelIn): void
    {
        this.form.setValue(values);
    }

    protected clearFields(): void
    {
        this.form.get('examination_date')?.setValue(new Date());
        this.form.get('examination_id')?.setValue(null);
    }

    protected onDateChanged(date: Date | null): void
    {
        if (Sftoomi.isEmpty(date) || this.form.invalid) {
            return;
        }

        this.onSearchClick();
    }

    protected override afterLoad(data: getExaminationsFiltersAPI) : void
    {
        super.afterLoad(data);

        this.examinationDatePickerCtrl.datesForHighlighting = data.data.dates_with_examinations.map((date: string): Date => {
            return Sftoomi.stringToDate(date)!;
        });
    }
}
