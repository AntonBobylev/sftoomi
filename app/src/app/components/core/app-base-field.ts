import { Directive, Input, output, OutputEmitterRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzPlacementType } from 'ng-zorro-antd/dropdown'

import Sftoomi from '../../class/Sftoomi';

@Directive()
export default abstract class AppBaseField
{
    @Input({required: true}) public form!: FormGroup;
    @Input({required: true}) public name!: string;
    @Input({required: true}) public label!: string;

    @Input() public tooltip: string | undefined;
    public readonly tooltipPlacement: NzPlacementType = 'bottomCenter';

    public readonly onChange: OutputEmitterRef<any> = output();

    protected readonly Sftoomi: typeof Sftoomi = Sftoomi;
}
