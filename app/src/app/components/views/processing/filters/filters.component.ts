import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { TuiAppearance, TuiCalendar, TuiError, TuiIcon, TuiLabel, TuiTextfieldComponent } from '@taiga-ui/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiDay } from '@taiga-ui/cdk';
import { AsyncPipe } from '@angular/common';
import { TuiButtonGroup, TuiFieldErrorPipe, TuiInputNumberDirective } from '@taiga-ui/kit';

import Sftoomi from '../../../../class/Sftoomi';

export type ProcessingFiltersPanelOut = {
    examination_date: Date,
    examination_id: number | null
}

@Component({
    selector: 'processing-module-filters-panel',
    templateUrl: './filters.component.html',
    imports: [
        TuiCalendar, ReactiveFormsModule, AsyncPipe,
        TuiError, TuiFieldErrorPipe, TuiLabel,
        TuiTextfieldComponent, TuiInputNumberDirective,
        TuiAppearance, TuiButtonGroup, TuiIcon
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

    protected examinationDate: TuiDay = TuiDay.fromLocalNativeDate(new Date());

    ngAfterViewInit(): void
    {
        // TODO: implement panel loading here

        this.onLoaded.emit(this.getValues());
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
}
