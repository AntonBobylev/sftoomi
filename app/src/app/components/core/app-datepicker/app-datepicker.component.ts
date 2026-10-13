import { AfterViewInit, Component, DestroyRef, inject, input, InputSignal, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';

import Sftoomi from '../../../class/Sftoomi'

import AppBaseField from '../app-base-field';

import FormErrorTemplateComponent from '../../templates/form-error-template/form-error-template.component';

import getDatePickerLocalDateFormat from '../../../locale/getDatePickerLocalDateFormat';

import AppDatePickerScrollMonthDirective from './scroll.directive'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-datepicker',
    templateUrl: './app-datepicker.component.html',
    styleUrl: './app-datepicker.component.less',
    imports: [
        FormErrorTemplateComponent, NzColDirective, NzDatePickerComponent,
        NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent,
        ReactiveFormsModule, AppDatePickerScrollMonthDirective
    ]
})

export default class AppDatepickerComponent extends AppBaseField implements AfterViewInit
{
    public readonly isInline:                  InputSignal<boolean> = input(false);
    public readonly datesForHighlightingInput: InputSignal<Date[]>  = input<Date[]>([], { alias: 'datesForHighlighting' });

    public override readonly onChange: OutputEmitterRef<Date | null> = output();

    protected readonly getDatePickerLocalDateFormat = getDatePickerLocalDateFormat;

    private readonly destroyRef: DestroyRef = inject(DestroyRef);

    private readonly datesToHighlight: WritableSignal<Date[]> = signal<Date[]>([]);

    ngOnInit(): void
    {
        this.datesToHighlight.set(this.datesForHighlightingInput());
    }

    ngAfterViewInit(): void
    {
        this.form.get(this.name)
            ?.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((date: Date | null): void => this.onChange.emit(date));
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
        let currentSelectedDate: Date | null = this.form.get(this.name)?.value;
        if (!currentSelectedDate) {
            return false;
        }

        return Sftoomi.twoDatesEqual(date, currentSelectedDate);
    }
}
