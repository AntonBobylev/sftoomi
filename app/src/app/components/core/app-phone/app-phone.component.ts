import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaskitoDirective } from '@maskito/angular';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzInputDirective, NzInputWrapperComponent } from 'ng-zorro-antd/input';

import AppBaseField from '../app-base-field';

import FormErrorTemplateComponent from '../../templates/form-error-template/form-error-template.component';

import phoneMask from '../../../misc/phone-mask-generator';

@Component({
    selector: 'app-phone',
    templateUrl: './app-phone.component.html',
    imports: [
        FormErrorTemplateComponent, NzColDirective, NzFormControlComponent,
        NzFormItemComponent, NzFormLabelComponent, NzInputDirective, NzInputWrapperComponent,
        ReactiveFormsModule, MaskitoDirective
    ],
    styleUrl: './app-phone.component.scss'
})

export default class AppPhoneComponent extends AppBaseField
{
    protected readonly phoneMask = phoneMask;
}
