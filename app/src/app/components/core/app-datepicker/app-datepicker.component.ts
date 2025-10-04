import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';

import AppBaseField from '../app-base-field';

import FormErrorTemplateComponent from '../../templates/form-error-template/form-error-template.component';

import getDatePickerLocalDateFormat from '../../../locale/getDatePickerLocalDateFormat';

@Component({
    selector: 'app-datepicker',
    templateUrl: './app-datepicker.component.html',
    styleUrl: './app-datepicker.component.scss',
    imports: [
        FormErrorTemplateComponent, NzColDirective, NzDatePickerComponent,
        NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent,
        ReactiveFormsModule
    ]
})
export default class AppDatepickerComponent extends AppBaseField implements AfterViewInit
{
    @Input() public isInline: boolean = false;

    @Output() public onValueChanged: EventEmitter<Date | null> = new EventEmitter<Date | null>();

    protected readonly getDatePickerLocalDateFormat = getDatePickerLocalDateFormat;

    ngAfterViewInit(): void
    {
        this.form.get(this.name)?.valueChanges.subscribe((date: Date | null): void => {
            this.onValueChanged.emit(date);
        });
    }
}
