import { AfterViewInit, Component, ViewChild } from '@angular/core';

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

export default class ProcessingModuleExaminationsPanelComponent implements AfterViewInit
{
    @ViewChild('tableCtrl')
    protected readonly tableCtrl!: ProcessingModuleExaminationsPanelTableComponent;

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
