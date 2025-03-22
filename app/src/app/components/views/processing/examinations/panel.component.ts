import { Component } from '@angular/core';

import ProcessingModuleExaminationsPanelToolbarComponent from './toolbar/toolbar.component';
import ProcessingModuleExaminationsPanelTableComponent from './table/table.component';

@Component({
    selector: 'processing-module-examinations-panel',
    templateUrl: './panel.component.html',
    imports: [
        ProcessingModuleExaminationsPanelToolbarComponent,
        ProcessingModuleExaminationsPanelTableComponent
    ],
    styleUrl: './panel.component.less'
})

export default class ProcessingModuleExaminationsPanelComponent
{
    protected onAddExaminationClick(): void
    {
        // TODO: implement
    }

    protected onEditExaminationClick(): void
    {
        // TODO: implement
    }

    protected onRemoveExaminationClick(): void
    {
        // TODO: implement
    }

    protected onRefreshClick(): void
    {
        // TODO: implement
    }
}
