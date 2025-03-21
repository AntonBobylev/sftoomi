import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiAccordion } from '@taiga-ui/experimental';

import Sftoomi from '../../../class/Sftoomi';

@Component({
    selector: 'processing-module',
    imports: [TuiAccordion],
    templateUrl: './processing.component.html',
    styleUrl: './processing.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export default class ProcessingComponent
{
    protected readonly Sftoomi = Sftoomi;
}
