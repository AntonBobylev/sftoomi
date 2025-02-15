import { Component, inject, Input } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';

import PatientsTableComponent from '../table.component';

import PopupMsgService from '../../../../../services/popup-msg.service';

@Component({
    selector: 'patients-table-toolbar',
    templateUrl: './toolbar.component.html',
    imports: [
        TuiButton
    ],
    styleUrl: './toolbar.component.scss'
})

export default class PatientsTableToolbarComponent
{
    @Input({required: true}) table!: PatientsTableComponent;

    private readonly popupMsg: PopupMsgService = inject(PopupMsgService);

    protected onRefreshClick(): void
    {
        this.table.refresh();
    }

    protected onEditClick(event: MouseEvent): void
    {
        event.stopPropagation();

        let selectedRecords: any[] = this.table.getSelection();
        if (selectedRecords.length < 1) {
            this.popupMsg.nothingSelected();

            return;
        }

        if (selectedRecords.length > 1) {
            this.popupMsg.moreThanOneSelected();

            return;
        }
    }
}
