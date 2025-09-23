import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';

import Sftoomi from '../../../class/Sftoomi';

import FormErrorComponent from '../form-error/form-error.component';

import getDatePickerLocalDateFormat from '../../../locale/getDatePickerLocalDateFormat';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'patient-demographics-template',
    templateUrl: './patient-demographics-template.component.html',
    imports: [
        ReactiveFormsModule,
        NzInputDirective,
        NzFormDirective,
        NzFormItemComponent,
        NzFormLabelComponent,
        NzFormControlComponent,
        NzColDirective,
        FormErrorComponent,
        NzDatePickerComponent,
        NzInputGroupComponent,
        NzIconDirective,
        NgTemplateOutlet
    ],
    styleUrl: './patient-demographics-template.component.less'
})
export default class PatientDemographicsTemplateComponent
{
    @Input({required: true}) public form!: FormGroup;

    protected readonly Sftoomi = Sftoomi;

    protected readonly getDatePickerLocalDateFormat = getDatePickerLocalDateFormat;
}
