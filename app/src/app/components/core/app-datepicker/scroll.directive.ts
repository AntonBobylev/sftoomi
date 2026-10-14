import { Directive, HostListener, inject, input, InputSignal } from '@angular/core';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { DateTime } from 'luxon'

import Sftoomi from '../../../class/Sftoomi'

import getLocalDateFormat from '../../../locale/getLocalDateFormat'

@Directive({
    selector: 'nz-date-picker[scrollable]'
})
export default class AppDatePickerScrollMonthDirective
{
    public readonly scrollable: InputSignal<boolean> = input(true);

    private readonly datePicker: NzDatePickerComponent = inject(NzDatePickerComponent);

    private readonly Sftoomi: typeof Sftoomi = Sftoomi;

    @HostListener('wheel', ['$event'])
    onWheel(event: WheelEvent): void
    {
        if (!this.scrollable()) {
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
        if (this.Sftoomi.isEmpty(currentValue)) {
            return;
        }

        const newDate: Date = DateTime.fromFormat(currentValue, getLocalDateFormat().date).toJSDate();
        newDate.setMonth(newDate.getMonth() + direction);
        this.datePicker.writeValue(newDate);
    }
}
