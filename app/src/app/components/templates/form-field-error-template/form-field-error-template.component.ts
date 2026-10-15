import { Component, input, InputSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';

import Sftoomi from '../../../class/Sftoomi';

@Component({
    selector: 'form-field-error-template',
    templateUrl: './form-field-error-template.component.html',
    styleUrl: './form-field-error-template.component.scss'
})

export default class FormFieldErrorTemplateComponent
{
    public readonly fieldName: InputSignal<string>    = input.required();
    public readonly fieldForm: InputSignal<FormGroup> = input.required();

    protected Sftoomi: typeof Sftoomi = Sftoomi;
}
