import { Component } from '@angular/core';

import ProcessingModuleExaminationsPanelTableRowComponent from './row/row.component';

@Component({
    selector: 'processing-module-examinations-panel-table',
    templateUrl: './table.component.html',
    imports: [
        ProcessingModuleExaminationsPanelTableRowComponent
    ],
    styleUrl: './table.component.less'
})

export default class ProcessingModuleExaminationsPanelTableComponent
{

}
