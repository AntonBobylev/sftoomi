import { Component } from '@angular/core';
import { TuiCardMedium } from '@taiga-ui/layout';
import { TuiAppearance } from '@taiga-ui/core';

@Component({
    selector: 'processing-module-examinations-panel-table-row',
    templateUrl: './row.component.html',
    imports: [
        TuiCardMedium,
        TuiAppearance
    ],
    styleUrl: './row.component.less'
})

export default class ProcessingModuleExaminationsPanelTableRowComponent
{

}
