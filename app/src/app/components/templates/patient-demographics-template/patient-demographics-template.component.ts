import { NgTemplateOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaskitoDirective } from '@maskito/angular';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzIconDirective } from 'ng-zorro-antd/icon';

import Sftoomi from '../../../class/Sftoomi';

import phoneMask from '../../../misc/phone-mask-generator';

import FormErrorTemplateComponent from '../form-error-template/form-error-template.component';

import UppercaseDirective from '../../../directives/uppercase.directive';

import getDatePickerLocalDateFormat from '../../../locale/getDatePickerLocalDateFormat';

@Component({
    selector: 'patient-demographics-template',
    templateUrl: './patient-demographics-template.component.html',
    imports: [
        ReactiveFormsModule, NzInputDirective, NzFormDirective,
        NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent,
        NzColDirective, FormErrorTemplateComponent, NzDatePickerComponent,
        NzInputGroupComponent, NzIconDirective, NgTemplateOutlet,
        UppercaseDirective, MaskitoDirective
    ],
    styleUrl: './patient-demographics-template.component.less'
})
export default class PatientDemographicsTemplateComponent
{
    @Input({required: true}) public form!: FormGroup;

    protected readonly Sftoomi = Sftoomi;

    protected readonly getDatePickerLocalDateFormat = getDatePickerLocalDateFormat;

    protected readonly phoneMask = phoneMask;
}
