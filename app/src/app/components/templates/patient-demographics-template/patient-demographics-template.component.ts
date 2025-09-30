import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzFormDirective } from 'ng-zorro-antd/form';

import Sftoomi from '../../../class/Sftoomi';

import AppTextfieldComponent from '../../core/app-textfield/app-textfield.component';

import AppDatepickerComponent from '../../core/app-datepicker/app-datepicker.component';
import AppPhoneComponent from '../../core/app-phone/app-phone.component';

@Component({
    selector: 'patient-demographics-template',
    templateUrl: './patient-demographics-template.component.html',
    imports: [
        ReactiveFormsModule, NzFormDirective, AppTextfieldComponent,
        AppDatepickerComponent, AppPhoneComponent
    ],
    styleUrl: './patient-demographics-template.component.less'
})
export default class PatientDemographicsTemplateComponent
{
    @Input({required: true}) public form!: FormGroup;

    @Input({required: true, alias: 'lastNameCtrlName'})   public lastName!: string;
    @Input({required: true, alias: 'firstNameCtrlName'})  public firstName!: string;
    @Input({required: true, alias: 'middleNameCtrlName'}) public middleName!: string;
    @Input({required: true, alias: 'dobNameCtrlName'})    public dobName!: string;
    @Input({required: true, alias: 'phoneNameCtrlName'})  public phoneName!: string;

    protected readonly Sftoomi = Sftoomi;
}
