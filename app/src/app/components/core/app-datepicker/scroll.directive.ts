import { Directive, HostListener, Input } from '@angular/core';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { DateTime } from 'luxon'

import Sftoomi from '../../../class/Sftoomi'

import getLocalDateFormat from '../../../locale/getLocalDateFormat'

@Directive({
    selector: 'nz-date-picker[AppDatePickerScrollMonth]'
})
export default class AppDatePickerScrollMonthDirective
{
    @Input() public AppDatePickerScrollMonth: boolean = true;

    constructor(private datePicker: NzDatePickerComponent)
    {
    }

    @HostListener('wheel', ['$event'])
    onWheel(event: WheelEvent): void
    {
        if (!this.AppDatePickerScrollMonth) {
            return;
        }

        event.preventDefault();

        event.deltaY < 0
            ? this.navigateMonth(-1)
            : this.navigateMonth(1);
    }

    private navigateMonth(direction: number): void
    {
        const currentValue: string = this.datePicker.inputValue;
        if (!Sftoomi.isEmpty(currentValue)) {
            const newDate: Date = DateTime.fromFormat(currentValue, getLocalDateFormat().date).toJSDate();
            newDate.setMonth(newDate.getMonth() + direction);
            this.datePicker.writeValue(newDate);
        }
    }
}
