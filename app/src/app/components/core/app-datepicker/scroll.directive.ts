import { Directive, HostListener } from '@angular/core';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';

import Sftoomi from '../../../class/Sftoomi'

@Directive({
    selector: 'nz-date-picker[AppDatePickerScrollMonth]'
})
export default class AppDatePickerScrollMonthDirective
{
    constructor(private datePicker: NzDatePickerComponent)
    {
    }

    @HostListener('wheel', ['$event'])
    onWheel(event: WheelEvent): void
    {
        event.preventDefault();

        event.deltaY < 0
            ? this.navigateMonth(-1)
            : this.navigateMonth(1);
    }

    private navigateMonth(direction: number): void
    {
        const currentValue: string = Sftoomi.dateShort(this.datePicker.inputValue);
        if (Sftoomi.isEmpty(currentValue)) {
            const newDate = new Date(currentValue);
            newDate.setMonth(newDate.getMonth() + direction);
            this.datePicker.writeValue(newDate);
        }
    }
}
