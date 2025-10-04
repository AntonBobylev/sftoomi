import { NgTemplateOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzIconDirective } from 'ng-zorro-antd/icon';

import AppBaseField from '../app-base-field'

import FormErrorTemplateComponent from '../../templates/form-error-template/form-error-template.component';

import OnlyNumbersDirective from '../../../directives/only-numbers.directive'

@Component({
    selector: 'app-numberfield',
    templateUrl: './app-numberfield.component.html',
    imports: [
        NzFormItemComponent, FormErrorTemplateComponent,
        NzColDirective, NzFormControlComponent, NzFormLabelComponent,
        NzInputGroupComponent, ReactiveFormsModule, NgTemplateOutlet,
        NzIconDirective, NzInputDirective, OnlyNumbersDirective
    ],
    styleUrl: './app-numberfield.component.less'
})

export default class AppNumberfieldComponent extends AppBaseField
{
    @Input() public allowDecimals: boolean = false;
    @Input() public allowNegative: boolean = false;
    @Input() public maxDecimalDigitsLength: number = 2;
    @Input() public maxLength: number | null = null;
}
