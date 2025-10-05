import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';

import Sftoomi from '../../../class/Sftoomi'

import AppBaseField from '../app-base-field';

import FormErrorTemplateComponent from '../../templates/form-error-template/form-error-template.component';

import getDatePickerLocalDateFormat from '../../../locale/getDatePickerLocalDateFormat';

import AppDatePickerScrollMonthDirective from './scroll.directive'


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
    @Input() public isInline: boolean = false;
    @Input() public datesForHighlighting: Date[] = [];

    @Output() public onValueChanged: EventEmitter<Date | null> = new EventEmitter<Date | null>();

    protected readonly getDatePickerLocalDateFormat = getDatePickerLocalDateFormat;

    ngAfterViewInit(): void
    {
        this.form.get(this.name)?.valueChanges.subscribe((date: Date | null): void => this.onValueChanged.emit(date));
    }

    protected shouldHighlightDate(currentDate: Date): boolean
    {
        if (Sftoomi.isEmpty(this.datesForHighlighting)) {
            return false;
        }

        return this.datesForHighlighting.some((date: Date): boolean => Sftoomi.twoDatesEqual(date, currentDate));
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
