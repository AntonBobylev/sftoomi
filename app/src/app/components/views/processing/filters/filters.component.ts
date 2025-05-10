import { AfterViewInit, Component, EventEmitter, Output, signal, WritableSignal } from '@angular/core';
import { TuiAppearance, TuiCalendar, TuiError, TuiIcon, TuiLabel, TuiLoader, TuiMarkerHandler, TuiTextfieldComponent } from '@taiga-ui/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiDay } from '@taiga-ui/cdk';
import { AsyncPipe } from '@angular/common';
import { TuiButtonGroup, TuiFieldErrorPipe, TuiInputNumberDirective } from '@taiga-ui/kit';

import Sftoomi from '../../../../class/Sftoomi';
import Fetcher from '../../../../class/Fetcher';

import getExaminationsFiltersAPI from '../../../../APIs/getExaminationsFiltersAPI';

export type ProcessingFiltersPanelOut = {
    examination_date: Date,
    examination_id: number | null
}

const ExaminationExistsMarker: [string] = ['var(--tui-status-positive)'];

@Component({
    selector: 'processing-module-filters-panel',
    templateUrl: './filters.component.html',
    imports: [
        TuiCalendar, ReactiveFormsModule, AsyncPipe,
        TuiError, TuiFieldErrorPipe, TuiLabel,
        TuiTextfieldComponent, TuiInputNumberDirective,
        TuiAppearance, TuiButtonGroup, TuiIcon, TuiLoader
    ],
    styleUrl: './filters.component.less'
})

export default class ProcessingFiltersPanelComponent implements AfterViewInit
{
    @Output() public onSearch: EventEmitter<ProcessingFiltersPanelOut> = new EventEmitter<ProcessingFiltersPanelOut>();
    @Output() public onClear: EventEmitter<ProcessingFiltersPanelOut> = new EventEmitter<ProcessingFiltersPanelOut>();
    @Output() public onLoaded: EventEmitter<ProcessingFiltersPanelOut> = new EventEmitter<ProcessingFiltersPanelOut>();

    protected readonly Sftoomi = Sftoomi;

    protected readonly form: FormGroup = new FormGroup({
        examination_id: new FormControl<number | null>(null, [Validators.min(1)])
    });

    protected readonly data: WritableSignal<getExaminationsFiltersAPI['data'] | undefined> = signal(undefined);
    protected readonly isLoading: WritableSignal<boolean> = signal(false);

    protected examinationCalendarMarkerHandler: TuiMarkerHandler = () => [];

    protected examinationDate: TuiDay = TuiDay.fromLocalNativeDate(new Date());

    private readonly getExaminationsFiltersUrl: string = '/getExaminationsFilters';

    ngAfterViewInit(): void
    {
        let me: this = this;
        me.isLoading.set(true);

        new Fetcher().request({
            url: me.getExaminationsFiltersUrl,
            success: function (_response: any, _request: any, data: getExaminationsFiltersAPI): void {
                me.isLoading.set(false);

                if (Sftoomi.isEmpty(data.data)) {
                    return;
                }

                me.data.set(data.data);

                me.examinationCalendarMarkerHandler = (day: TuiDay)=>
                    data.data.dates_with_examinations
                        .map((date: string): string | null => Sftoomi.dateShort(date))
                        .includes(Sftoomi.dateShort(day.toLocalNativeDate()) ?? '') ? ExaminationExistsMarker : [];

                me.onLoaded.emit(me.getValues());
            },
            failure: function (code: any, message: any, _request: any): void {
                me.isLoading.set(false);

                if (message === 'canceled') {
                    return;
                }

                console.error(code);
                console.error(message);
            }
        })
    }

    public getValues(): ProcessingFiltersPanelOut
    {
        return {
            examination_date: this.examinationDate.toLocalNativeDate(),
            examination_id:   this.form.get('examination_id')?.value ?? ''
        };
    }

    public clearForm(): void
    {
        this.examinationDate = TuiDay.fromLocalNativeDate(new Date());
        this.form.get('examination_id')?.setValue(null);

        this.onClear.emit(this.getValues());
    }

    protected onExaminationDateClick(date: TuiDay): void
    {
        this.examinationDate = date;
        this.onSearch.emit(this.getValues());
    }
}
