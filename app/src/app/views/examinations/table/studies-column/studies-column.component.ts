import { Component, input, InputSignal } from '@angular/core';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { NzButtonComponent } from 'ng-zorro-antd/button'

import Sftoomi from '../../../../class/Sftoomi';

import ExaminationsTableComponent, { ExaminationsTableRow, ExaminationsTableRowExam } from '../table.component';

@Component({
    selector: 'examinations-table-studies-column',
    templateUrl: './studies-column.component.html',
    styleUrl: './studies-column.component.less',
    imports: [NzTooltipDirective, NzDividerComponent, NzButtonComponent]
})

export default class ExaminationsTableStudiesColumnComponent
{
    public readonly rowData: InputSignal<ExaminationsTableRow>       = input.required();
    public readonly table:   InputSignal<ExaminationsTableComponent> = input.required();

    protected readonly Sftoomi: typeof Sftoomi = Sftoomi;

    protected getExamAddEditButtonConfig(exam: ExaminationsTableRowExam): { title: string, tooltip: string }
    {
        let actionTranslationKey: string = exam.exam_drafts_exists ? 'edit_report_draft' : 'add_report_draft';

        return {
            title: this.Sftoomi.Translator.translate(
                this.Sftoomi.format(
                    'views.examinations.table.columns.studies.{0}',
                    [
                        actionTranslationKey
                    ]
                )
            ),
            tooltip: this.Sftoomi.Translator.translate(
                this.Sftoomi.format(
                    'views.examinations.table.columns.studies.{0}_tooltip',
                    [
                        actionTranslationKey
                    ]
                )
            )
        };
    }

    protected onAddEditDraftClick(event: PointerEvent, exam: ExaminationsTableRowExam): void
    {
        event.stopPropagation();

        // TODO: implement
    }
}
