import { Component } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaskitoDirective } from '@maskito/angular';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzIconDirective } from 'ng-zorro-antd/icon';

import AppBaseField from '../app-base-field';

import FormErrorTemplateComponent from '../../templates/form-error-template/form-error-template.component';

import phoneMask from '../../../misc/phone-mask-generator';

@Component({
    selector: 'app-phone',
    templateUrl: './app-phone.component.html',
    imports: [
        FormErrorTemplateComponent,
        NzColDirective,
        NzFormControlComponent,
        NzFormItemComponent,
        NzFormLabelComponent,
        NzInputDirective,
        NzInputGroupComponent,
        ReactiveFormsModule,
        MaskitoDirective,
        NgTemplateOutlet,
        NzIconDirective
    ],
    styleUrl: './app-phone.component.scss'
})

export default class AppPhoneComponent extends AppBaseField
{
    protected readonly phoneMask = phoneMask;
}
