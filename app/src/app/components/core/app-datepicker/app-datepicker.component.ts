import { AfterViewInit, Component, DestroyRef, inject, input, InputSignal, output, OutputEmitterRef, signal, WritableSignal, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';

import Sftoomi from '../../../class/Sftoomi'

import AppBaseField from '../base/app-base-field';

import FormFieldErrorTemplateComponent from '../../templates/form-field-error-template/form-field-error-template.component';

import getDatePickerLocalDateFormat from '../../../locale/getDatePickerLocalDateFormat';

import AppDatePickerScrollMonthDirective from './scroll.directive'

@Component({
    selector: 'app-datepicker',
    templateUrl: './app-datepicker.component.html',
    styleUrl: './app-datepicker.component.less',
    imports: [
        FormFieldErrorTemplateComponent, NzColDirective, NzDatePickerComponent,
        NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent,
        ReactiveFormsModule, AppDatePickerScrollMonthDirective
    ]
})

export default class AppDatepickerComponent extends AppBaseField implements AfterViewInit, OnInit
{
    public readonly isInline:                  InputSignal<boolean> = input(false);
    public readonly datesForHighlightingInput: InputSignal<Date[]>  = input<Date[]>([], { alias: 'datesForHighlighting' });

    public override readonly changeEvent: OutputEmitterRef<Date | null> = output();

    protected readonly getDatePickerLocalDateFormat = getDatePickerLocalDateFormat;

    private readonly destroyRef: DestroyRef = inject(DestroyRef);

    private readonly datesToHighlight: WritableSignal<Date[]> = signal<Date[]>([]);

    ngOnInit(): void
    {
        this.datesToHighlight.set(this.datesForHighlightingInput());
    }

    ngAfterViewInit(): void
    {
        this.getControl()
            ?.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((date: Date | null): void => this.changeEvent.emit(date));
    }

    public setDatesForHighlighting(dates: Date[]): void
    {
        this.datesToHighlight.set(dates);
    }

    protected shouldHighlightDate(currentDate: Date): boolean
    {
        const datesToHighlight: Date[] = this.datesToHighlight();
        if (Sftoomi.isEmpty(datesToHighlight)) {
            return false;
        }

        return datesToHighlight.some((date: Date): boolean => Sftoomi.twoDatesEqual(date, currentDate));
    }

    protected isToday(date: Date): boolean
    {
        return Sftoomi.twoDatesEqual(new Date(), date);
    }

    protected isSelected(date: Date): boolean
    {
        const currentSelectedDate: Date | null = this.getControl()?.value;
        if (!currentSelectedDate) {
            return false;
        }

        return Sftoomi.twoDatesEqual(date, currentSelectedDate);
    }
}
