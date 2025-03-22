import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiAccordion } from '@taiga-ui/experimental';

import Sftoomi from '../../../class/Sftoomi';

import ProcessingFiltersPanelComponent, { ProcessingFiltersPanelOut } from './filters/filters.component';
import ProcessingModuleExaminationsPanelComponent from './examinations/panel.component';

@Component({
    selector: 'processing-module',
    imports: [
        TuiAccordion, ProcessingFiltersPanelComponent,
        ProcessingModuleExaminationsPanelComponent
    ],
    templateUrl: './processing.component.html',
    styleUrl: './processing.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export default class ProcessingComponent
{
    protected readonly Sftoomi = Sftoomi;

    protected search(values: ProcessingFiltersPanelOut): void
    {
        // TODO: implement
    }
}
