import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import Sftoomi from '../../../../class/Sftoomi';

@Component({
    selector: 'form-error',
    templateUrl: './form-error.component.html',
    imports: [],
    styleUrl: './form-error.component.scss'
})

export default class FormErrorComponent
{
    @Input({required: true}) fieldName!: string
    @Input({required: true}) parentFormGroup!: FormGroup

    protected Sftoomi = Sftoomi;

    constructor(protected sanitizer: DomSanitizer)
    {
    }
}
