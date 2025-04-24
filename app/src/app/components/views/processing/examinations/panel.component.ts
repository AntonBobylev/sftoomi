import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { defaultIfEmpty } from 'rxjs';

import Sftoomi from '../../../../class/Sftoomi';

import ProcessingModuleExaminationsPanelToolbarComponent from './toolbar/toolbar.component';
import ProcessingModuleExaminationsPanelTableComponent from './table/table.component';
import ExaminationEditDialogComponent, { ExaminationEditDialogData } from './dialog/dialog.component';

@Component({
    selector: 'processing-module-examinations-panel',
    templateUrl: './panel.component.html',
    imports: [
        ProcessingModuleExaminationsPanelToolbarComponent,
        ProcessingModuleExaminationsPanelTableComponent
    ],
    styleUrl: './panel.component.less'
})

export default class ProcessingModuleExaminationsPanelComponent implements AfterViewInit
{
    @ViewChild('tableCtrl')
    protected readonly tableCtrl!: ProcessingModuleExaminationsPanelTableComponent;

    private readonly dialog: TuiDialogService = inject(TuiDialogService);

    ngAfterViewInit(): void
    {
        this.tableCtrl.setData({
            rows: [{
                examination_id: 1,
                patient: {
                    id: 12,
                    last_name: 'Bobylev',
                    first_name: 'Anton',
                    middle_name: 'Aleksandrovich',
                    dob: '2001-02-19',
                    phone: '+7 911 549-22-93'
                },
                studies: [{
                    exam_id: 123,
                    id: 1,
                    short_name: 'COVID',
                    full_name: 'COVID-19'
                }, {
                    exam_id: 111,
                    id: 1,
                    short_name: 'COVID',
                    full_name: 'COVID-19'
                }],
                facility: {
                    id: 2,
                    short_name: 'VCDH',
                    full_name: 'Vologda Central District Hospital'
                },
                doctor: {
                    id: 4,
                    last_name: 'CHEREVKOV',
                    first_name: 'MIKHAIL',
                    middle_name: 'NOKOLAYEVICH'
                }
            }, {
                examination_id: 2,
                patient: {
                    id: 5,
                    last_name: 'Bobyleva',
                    first_name: 'Tamara',
                    middle_name: 'Sergeevna',
                },
                studies: [{
                    exam_id: 321,
                    id: 1,
                    short_name: 'COVID',
                    full_name: 'COVID-19'
                }],
                facility: {
                    id: 1,
                    short_name: 'VCRH',
                    full_name: 'Vologda Central Regional Hospital'
                }
            }]
        });
    }

    protected onAddExaminationClick(): void
    {
        let me: this = this;
        this.dialog.open(new PolymorpheusComponent(ExaminationEditDialogComponent), {
            label: Sftoomi.Translator.translate('views.processing.add_examination'),
            data: {
                id: 1
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
