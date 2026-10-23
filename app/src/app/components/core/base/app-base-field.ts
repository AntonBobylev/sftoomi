import { Directive, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { NzPlacementType } from 'ng-zorro-antd/dropdown'

import Sftoomi from '../../../class/Sftoomi';

@Directive()
export default abstract class AppBaseField<OnChangeEvent = any>
{
    public readonly form:  InputSignal<FormGroup>     = input.required();
    public readonly name:  InputSignal<string>        = input.required();
    public readonly label: InputSignal<string | null> = input<string | null>(null);

    public readonly tooltip:     InputSignal<string | undefined> = input();
    public readonly placeholder: InputSignal<string | null>      = input<string | null>(null);

    public readonly changeEvent: OutputEmitterRef<OnChangeEvent> = output();

    protected readonly tooltipPlacement: NzPlacementType = 'bottomCenter';

    protected readonly Sftoomi: typeof Sftoomi = Sftoomi;

    protected getControl(): AbstractControl | null
    {
        return this.form().get(this.name()) ?? null;
    }
}
