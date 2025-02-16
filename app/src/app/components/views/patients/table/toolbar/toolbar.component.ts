import { Component, inject, Input } from '@angular/core';
import { TuiButton, TuiHint } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { TuiDialogService } from '@taiga-ui/core';

import Sftoomi from '../../../../../class/Sftoomi';

import Fetcher from '../../../../../class/Fetcher';

import PopupMsgService from '../../../../../services/popup-msg.service';

import PatientEditDialogComponent, { PatientEditDialogData } from '../../dialog/dialog.component';
import PatientsTableComponent from '../table.component';

@Component({
    selector: 'patients-table-toolbar',
    templateUrl: './toolbar.component.html',
    imports: [
        TuiButton,
        TuiHint
    ],
    styleUrl: './toolbar.component.scss'
})

export default class PatientsTableToolbarComponent
{
    @Input({required: true}) table!: PatientsTableComponent;

    protected readonly Sftoomi = Sftoomi;

    private readonly popupMsg: PopupMsgService = inject(PopupMsgService);
    private readonly dialog: TuiDialogService = inject(TuiDialogService);

    protected onRefreshClick(): void
    {
        this.table.refresh();
    }

    protected onAddClick(event: MouseEvent): void
    {
        event.stopPropagation();

        this.openPatientEditDialog(Sftoomi.Translator.translate('views.patients.dialog.add_title'));
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

        let id: number = selectedRecords[0].id;
        this.openPatientEditDialog(
            Sftoomi.format(Sftoomi.Translator.translate('views.patients.dialog.edit_title'), [id]),
            id
        );
    }

    protected onRemoveClick(event: MouseEvent): void
    {
        event.stopPropagation();

        let selectedRecords: any[] = this.table.getSelection();
        if (selectedRecords.length < 1) {
            this.popupMsg.nothingSelected();

            return;
        }

        let me: this = this,
            data: FormData = new FormData();

        data.append('ids', selectedRecords.map(function (record: any): number {
            return record.id;
        }).join(','));

        me.table.setIsLoading(true);
        new Fetcher().request({
            url: 'http://localhost:8080/removePatient',
            data: data,
            success: function (_response: any, _request: any, _data: any): void {
                me.table.setIsLoading(false);

                me.table.refresh();
            },
            failure: function (): void {
                me.table.setIsLoading(false);
            }
        })
    }

    private openPatientEditDialog(title: string, id?: number): void
    {
        let me: this = this;
        this.dialog.open(new PolymorpheusComponent(PatientEditDialogComponent), {
            label: title,
            dismissible: false,
            size: 'auto',
            data: {
                id: id
            } as PatientEditDialogData
        }).subscribe({
            complete: (): void => {
                me.table.refresh();
            }
        });
    }
}
