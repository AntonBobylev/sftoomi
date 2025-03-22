import { Component, EventEmitter, Output } from '@angular/core';
import { TuiButton, TuiHintDirective } from '@taiga-ui/core';

import Sftoomi from '../../../../../class/Sftoomi';

@Component({
    selector: 'processing-module-examinations-panel-toolbar',
    templateUrl: './toolbar.component.html',
    imports: [
        TuiButton,
        TuiHintDirective
    ],
    styleUrl: './toolbar.component.less'
})

export default class ProcessingModuleExaminationsPanelToolbarComponent
{
    @Output() public readonly onAdd: EventEmitter<undefined> = new EventEmitter<undefined>();
    @Output() public readonly onEdit: EventEmitter<undefined> = new EventEmitter<undefined>();
    @Output() public readonly onRemove: EventEmitter<undefined> = new EventEmitter<undefined>();
    @Output() public readonly onRefresh: EventEmitter<undefined> = new EventEmitter<undefined>();

    protected readonly Sftoomi = Sftoomi;
}
