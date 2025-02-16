import { Component, inject, Input } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { TuiDialogService } from '@taiga-ui/core';

import Sftoomi from '../../../../../class/Sftoomi';

import PopupMsgService from '../../../../../services/popup-msg.service';
import PatientEditDialogComponent, { PatientEditDialogData } from '../../dialog/dialog.component';

import PatientsTableComponent from '../table.component';

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
    private readonly dialog: TuiDialogService = inject(TuiDialogService);

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

        let me: this = this;
        this.dialog.open(new PolymorpheusComponent(PatientEditDialogComponent), {
            label: Sftoomi.format(Sftoomi.Translator.translate('views.patients.dialog.title'), [selectedRecords[0].id]),
            dismissible: false,
            data: {
                id: selectedRecords[0].id
            } as PatientEditDialogData
        }).subscribe({
            complete: (): void => {
                me.table.refresh();
            }
        });
    }
}
