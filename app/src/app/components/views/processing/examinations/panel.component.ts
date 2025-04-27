import { Component, effect, inject, Input, signal, ViewChild, WritableSignal } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { defaultIfEmpty } from 'rxjs';

import Sftoomi from '../../../../class/Sftoomi';

import ProcessingModuleExaminationsPanelToolbarComponent from './toolbar/toolbar.component';
import ProcessingModuleExaminationsPanelTableComponent, { ProcessingModuleExaminationsPanelTableData, ProcessingModuleExaminationsPanelTableRowData } from './table/table.component';
import ExaminationEditDialogComponent, { ExaminationEditDialogData } from './dialog/dialog.component';

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

    @Input() public data: WritableSignal<getExaminationsAPI['data']> = signal<getExaminationsAPI['data']>([]);

    private readonly dialog: TuiDialogService = inject(TuiDialogService);

    constructor()
    {
        let me: this = this;
        effect((): void => {
            if (me.data().length > 0) {
                let tableData: ProcessingModuleExaminationsPanelTableData = {
                    rows: me.data().map(function (row): ProcessingModuleExaminationsPanelTableRowData {
                        return {
                            examination_id: row.id,
                            patient: row.patient,
                            doctor: row.doctor,
                            facility: row.facility,
                            studies: row.studies
                        };
                    })
                };

                me.tableCtrl.setData(tableData);
            }
        });
    }

    protected onAddExaminationClick(): void
    {
        let me: this = this;
        this.dialog.open(new PolymorpheusComponent(ExaminationEditDialogComponent), {
            label: Sftoomi.Translator.translate('views.processing.add_examination'),
            data: {
                //id: 1 // TODO: implement
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
