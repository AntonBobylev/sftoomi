import { EventEmitter, Output, Component, effect, inject, Input, signal, ViewChild, WritableSignal } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { defaultIfEmpty } from 'rxjs';

import Sftoomi from '../../../../class/Sftoomi';

import ProcessingModuleExaminationsPanelToolbarComponent from './toolbar/toolbar.component';
import ProcessingModuleExaminationsPanelTableComponent, { ProcessingModuleExaminationsPanelTableData, ProcessingModuleExaminationsPanelTableRowData } from './table/table.component';
import ExaminationEditDialogComponent, { ExaminationEditDialogData } from './dialog/dialog.component';
import ProcessingComponent from '../processing.component';

import PopupMsgService from '../../../../services/popup-msg.service';

import getExaminationsAPI from '../../../../APIs/getExaminationsAPI';

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
    @ViewChild('tableCtrl')
    protected readonly tableCtrl!: ProcessingModuleExaminationsPanelTableComponent;

    @ViewChild('toolbarCtrl')
    protected readonly toolbarCtrl!: ProcessingModuleExaminationsPanelToolbarComponent;

    @Output() public onRefresh: EventEmitter<any> = new EventEmitter<any>();

    @Input() public data: WritableSignal<getExaminationsAPI['data']> = signal<getExaminationsAPI['data']>([]);
    @Input({required: true}) public moduleCtrl!: ProcessingComponent;

    private readonly dialog: TuiDialogService = inject(TuiDialogService);
    private readonly popupMsg: PopupMsgService = inject(PopupMsgService);

    constructor()
    {
        let me: this = this;
        effect((): void => {
            let tableData: ProcessingModuleExaminationsPanelTableData = {
                rows: me.data().map(function (row): ProcessingModuleExaminationsPanelTableRowData {
                    return {
                        examination_id: row.id,
                        date:           row.date,
                        patient:        row.patient,
                        doctor:         row.doctor,
                        facility:       row.facility,
                        studies:        row.studies
                    };
                })
            };

            if (!me.tableCtrl) {
                return;
            }

            me.tableCtrl.setData(tableData);

            if (!me.toolbarCtrl) {
                return;
            }

            me.toolbarCtrl.setData(tableData);
        });
    }

    protected onAddExaminationClick(): void
    {
        let me: this = this;
        this.dialog.open(new PolymorpheusComponent(ExaminationEditDialogComponent), {
            label: Sftoomi.Translator.translate('views.processing.add_examination'),
            data: {
                date: me.moduleCtrl.getFiltersControl().getValues().examination_date
            } as ExaminationEditDialogData
        })
            .pipe(defaultIfEmpty({saved: false}))
            .subscribe((result: any): void => {
                if (result?.saved) {
                    me.tableCtrl.refresh();
                }
            });
    }

    protected onEditExaminationClick(): void
    {
        let selectedRecords: ProcessingModuleExaminationsPanelTableRowData[] = this.tableCtrl.getSelectedRecords();
        if (selectedRecords.length < 1) {
            this.popupMsg.nothingSelected();

            return;
        }

        if (selectedRecords.length > 1) {
            this.popupMsg.moreThanOneSelected();

            return;
        }

        let me: this = this;
        this.dialog.open(new PolymorpheusComponent(ExaminationEditDialogComponent), {
            label: Sftoomi.format(Sftoomi.Translator.translate('views.processing.edit_examination'), [selectedRecords[0].examination_id]),
            data: {
                id: selectedRecords[0].examination_id
            } as ExaminationEditDialogData
        })
            .pipe(defaultIfEmpty({saved: false}))
            .subscribe((result: any): void => {
                if (result?.saved) {
                    me.tableCtrl.refresh();
                }
            });
    }

    protected onRemoveExaminationClick(): void
    {
        // TODO: implement
    }
}
