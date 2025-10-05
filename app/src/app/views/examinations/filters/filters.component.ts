import { AfterViewInit, Component, EventEmitter, Output, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonComponent } from 'ng-zorro-antd/button'
import { NzIconDirective } from 'ng-zorro-antd/icon'
import { NzCardComponent } from 'ng-zorro-antd/card'

import Fetcher from '../../../class/Fetcher';
import Sftoomi from '../../../class/Sftoomi';
import { DialogType } from '../../../class/Dialog';

import AppNumberfieldComponent from '../../../components/core/app-numberfield/app-numberfield.component'
import AppDatepickerComponent from '../../../components/core/app-datepicker/app-datepicker.component'

import getExaminationsFiltersAPI from '../../../APIs/getExaminationsFiltersAPI';
import AppLoadingSpinnerComponent from '../../../components/misc/app-loading-spinner/app-loading-spinner.component'

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

export default class ExaminationsFiltersComponent implements AfterViewInit
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

    protected readonly data: WritableSignal<getExaminationsFiltersAPI['data'] | undefined> = signal<getExaminationsFiltersAPI['data'] | undefined>(undefined);
    protected readonly isLoading: WritableSignal<boolean> = signal<boolean>(false);

    protected readonly Sftoomi = Sftoomi

    private readonly getExaminationsFiltersUrl: string = '/getExaminationsFilters';

    ngAfterViewInit(): void
    {
        this.clearForm(false);

        this.isLoading.set(true);
        new Fetcher().request({
            url: this.getExaminationsFiltersUrl,
            success: (_response: any, _request: any, data: getExaminationsFiltersAPI): void => {
                if (Sftoomi.isEmpty(data.data)) {
                    return;
                }

                this.data.set(data.data);

                this.examinationDatePickerCtrl.datesForHighlighting = data.data.dates_with_examinations.map((date: string): Date => {
                    return Sftoomi.stringToDate(date)!;
                });

                this.onLoaded.emit(this.getValues());
            },
            failure: (_code: any, message: any, _request: any): void => {
                if (message === 'canceled') {
                    return;
                }

                Sftoomi.Dialog.show(message, DialogType.ERROR);
            },
            finally: (): void => {
                this.isLoading.set(false);
            }
        })
    }

    public getValues(): ExaminationsFiltersPanelOut
    {
        return {
            examination_date: this.form.get('examination_date')?.value,
            examination_id:   this.form.get('examination_id')?.value ?? ''
        };
    }

    public clearForm(doSearch: boolean = true): void
    {
        this.form.get('examination_date')?.setValue(new Date());
        this.form.get('examination_id')?.setValue(null);

        this.onClear.emit(Sftoomi.mergeObjects(
            this.getValues(),
            { doSearch: doSearch || false }
        ) as ExaminationsFiltersPanelClearEventData);
    }

    protected onSearchClick(): void
    {
        if (this.form.invalid) {
            Sftoomi.popupMsgService?.formInvalid();

            return;
        }

        this.onSearch.emit(this.getValues());
    }

    protected onDateChanged(date: Date | null): void
    {
        if (Sftoomi.isEmpty(date) || this.form.invalid) {
            return;
        }

        this.onSearchClick();
    }
}
