import { Directive, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import Sftoomi from '../../class/Sftoomi';

@Directive()
export default class AppBaseField
{
    @Input({required: true}) public label!: string;
    @Input({required: true}) public name!: string;
    @Input({required: true, alias: 'parentFormGroup'}) public form!: FormGroup;

    protected readonly Sftoomi = Sftoomi;
}
