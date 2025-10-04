import { AfterViewInit, Component, EventEmitter, Output, signal, WritableSignal } from '@angular/core';
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

export type ProcessingFiltersPanelOut = {
    examination_date: Date,
    examination_id:   number | null
}

@Component({
    selector: 'examinations-module-filters-panel',
    templateUrl: './filters.component.html',
    imports: [
        ReactiveFormsModule,
        AppNumberfieldComponent,
        NzButtonComponent,
        NzIconDirective,
        NzCardComponent,
        AppDatepickerComponent
    ],
    styleUrl: './filters.component.less'
})

export class ExaminationsFiltersComponent implements AfterViewInit
{
    @Output() public onSearch: EventEmitter<ProcessingFiltersPanelOut> = new EventEmitter<ProcessingFiltersPanelOut>();
    @Output() public onClear: EventEmitter<ProcessingFiltersPanelOut> = new EventEmitter<ProcessingFiltersPanelOut>();
    @Output() public onLoaded: EventEmitter<ProcessingFiltersPanelOut> = new EventEmitter<ProcessingFiltersPanelOut>();

    protected readonly form: FormGroup = new FormGroup({
        examination_date: new FormControl<Date | null>(null),
        examination_id:   new FormControl<number | null>(null, [Validators.min(1), Validators.max(Sftoomi.Constants.types.int.unsigned)])
    });

    protected readonly data: WritableSignal<getExaminationsFiltersAPI['data'] | undefined> = signal<getExaminationsFiltersAPI['data'] | undefined>(undefined);
    protected readonly isLoading: WritableSignal<boolean> = signal<boolean>(false);

    protected readonly Sftoomi = Sftoomi

    private readonly getExaminationsFiltersUrl: string = '/getExaminationsFilters';

    ngAfterViewInit(): void
    {
        this.isLoading.set(true);

        new Fetcher().request({
            url: this.getExaminationsFiltersUrl,
            success: (_response: any, _request: any, data: getExaminationsFiltersAPI): void => {
                this.isLoading.set(false);

                if (Sftoomi.isEmpty(data.data)) {
                    return;
                }

                this.data.set(data.data);

                this.onLoaded.emit(this.getValues());
            },
            failure: (_code: any, message: any, _request: any): void => {
                this.isLoading.set(false);

                if (message === 'canceled') {
                    return;
                }

                Sftoomi.Dialog.show(message, DialogType.ERROR);
            }
        })
    }

    public getValues(): ProcessingFiltersPanelOut
    {
        return {
            examination_date: new Date(),
            examination_id:   this.form.get('examination_id')?.value ?? ''
        };
    }

    public clearForm(): void
    {
        this.form.get('examination_id')?.setValue(null);

        this.onClear.emit(this.getValues());
    }

    protected onExaminationDateClick(date: any): void
    {
         this.onSearch.emit(this.getValues());
    }

    protected onTodayClick(): void
    {
    }
}
