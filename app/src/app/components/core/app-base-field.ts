import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import Sftoomi from '../../class/Sftoomi';

@Directive()
export default abstract class AppBaseField
{
    @Input({required: true}) public form!: FormGroup;
    @Input({required: true}) public name!: string;
    @Input({required: true}) public label!: string;

    @Input() public tooltip: string | undefined;

    protected readonly Sftoomi = Sftoomi;

    @Output() public onChange: EventEmitter<any> = new EventEmitter<any>();
}
