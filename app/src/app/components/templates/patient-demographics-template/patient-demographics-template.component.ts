import { Component, input, InputSignal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzFormDirective } from 'ng-zorro-antd/form';

import Sftoomi from '../../../class/Sftoomi';

import AppTextFieldComponent from '../../core/app-text-field/app-text-field.component';
import AppDatepickerComponent from '../../core/app-datepicker/app-datepicker.component';
import AppPhoneComponent from '../../core/app-phone.component';
import AppGenderComboComponent from '../../core/app-gender-combo.component';

@Component({
    selector: 'patient-demographics-template',
    templateUrl: './patient-demographics-template.component.html',
    imports: [
        ReactiveFormsModule, NzFormDirective, AppTextFieldComponent,
        AppDatepickerComponent, AppPhoneComponent, AppGenderComboComponent
    ],
    styleUrl: './patient-demographics-template.component.less'
})
export default class PatientDemographicsTemplateComponent
{
    public readonly form: InputSignal<FormGroup> = input.required();

    public readonly lastName:   InputSignal<string> = input.required({ alias: 'lastNameCtrlName'   });
    public readonly firstName:  InputSignal<string> = input.required({ alias: 'firstNameCtrlName'  });
    public readonly middleName: InputSignal<string> = input.required({ alias: 'middleNameCtrlName' });
    public readonly dobName:    InputSignal<string> = input.required({ alias: 'dobNameCtrlName'    });
    public readonly phoneName:  InputSignal<string> = input.required({ alias: 'phoneNameCtrlName'  });
    public readonly genderName: InputSignal<string> = input.required({ alias: 'genderCtrlName'     });

    public readonly isVertical: InputSignal<boolean> = input(true);

    protected readonly Sftoomi: typeof Sftoomi = Sftoomi;
}
