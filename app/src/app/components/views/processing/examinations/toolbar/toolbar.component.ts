import { Component, EventEmitter, Output, signal, WritableSignal } from '@angular/core';
import { TuiButton, TuiHintDirective } from '@taiga-ui/core';

import Sftoomi from '../../../../../class/Sftoomi';
import { ProcessingModuleExaminationsPanelTableData } from '../table/table.component';

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

    protected readonly data: WritableSignal<ProcessingModuleExaminationsPanelTableData> = signal<ProcessingModuleExaminationsPanelTableData>({rows: []});

    protected readonly Sftoomi = Sftoomi;

    public setData(data: ProcessingModuleExaminationsPanelTableData): void
    {
        this.data.set(data);
    }
}
