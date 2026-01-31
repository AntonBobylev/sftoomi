import { Component } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';

import Sftoomi from '../../../../class/Sftoomi';

import AppBaseToolbar from '../../../../components/core/app-base-toolbar';

import ReportTemplateEditDialogComponent, { ReportTemplateEditDialogData } from '../../dialog/dialog.component'

@Component({
    selector: 'report-templates-table-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrl: './toolbar.component.less',
    imports: [
        NzButtonComponent,
        NzIconDirective,
        NzTooltipDirective
    ]
})

export default class ReportTemplatesTableToolbarComponent extends AppBaseToolbar
{
    protected override readonly editDialogAddTitle: string = Sftoomi.Translator.translate('views.report_templates.dialog.add_title');
    protected override readonly editDialogEditTitle: string = Sftoomi.Translator.translate('views.report_templates.dialog.edit_title');

    protected openEditDialog(title: string, id?: number): void
    {
        const modal = Sftoomi.Dialog.getInstance().create<ReportTemplateEditDialogComponent, ReportTemplateEditDialogData>({
            nzTitle: title,
            nzContent: ReportTemplateEditDialogComponent,
            nzViewContainerRef: this.viewContainerRef,
            nzData: { id: id }
        });

        modal.afterClose.subscribe((isSaved: boolean = false): void => {
            if (isSaved) {
                this.table.refresh();
            }
        });
    }
}
