import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import Sftoomi from '../../../class/Sftoomi';

@Component({
    selector: 'form-error-template',
    templateUrl: './form-error-template.component.html',
    imports: [],
    styleUrl: './form-error-template.component.scss'
})

export default class FormErrorTemplateComponent
{
    @Input({required: true}) fieldName!: string
    @Input({required: true}) parentFormGroup!: FormGroup

    protected Sftoomi = Sftoomi;

    constructor(protected sanitizer: DomSanitizer)
    {
    }
}
