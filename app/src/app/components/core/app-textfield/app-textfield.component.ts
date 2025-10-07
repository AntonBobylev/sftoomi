import { NgTemplateOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzIconDirective } from 'ng-zorro-antd/icon';

import FormErrorTemplateComponent from '../../templates/form-error-template/form-error-template.component';
import AppUppercaseAbleField from '../app-uppercase-able-field';

@Component({
    selector: 'app-textfield',
    templateUrl: './app-textfield.component.html',
    imports: [
        NzFormItemComponent, FormErrorTemplateComponent,
        NzColDirective, NzFormControlComponent, NzFormLabelComponent,
        NzInputGroupComponent, ReactiveFormsModule, NgTemplateOutlet,
        NzIconDirective, NzInputDirective
    ],
    styleUrl: './app-textfield.component.scss'
})

export default class AppTextfieldComponent extends AppUppercaseAbleField
{
    @Input() public securedInput: boolean = false;

    protected isSecuredInputVisible: boolean = false;

    protected getFieldType(): string
    {
        if (this.securedInput) {
            return this.isSecuredInputVisible ? 'text' : 'password';
        }

        return 'text';
    }
}
