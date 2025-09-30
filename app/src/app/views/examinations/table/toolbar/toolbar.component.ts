import { Component } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';

import Sftoomi from '../../../../class/Sftoomi';

import AppBaseToolbar from '../../../../components/core/app-base-toolbar';

@Component({
    selector: 'examinations-table-toolbar',
    templateUrl: './toolbar.component.html',
    imports: [
        NzButtonComponent,
        NzIconDirective,
        NzTooltipDirective
    ]
})

export default class ExaminationsTableToolbarComponent extends AppBaseToolbar
{
    protected override readonly editDialogAddTitle: string = Sftoomi.Translator.translate('views.examinations.dialog.add_title');
    protected override readonly editDialogEditTitle: string = Sftoomi.Translator.translate('views.examinations.dialog.edit_title');

    protected override readonly removeUrl: string = '/removeExamination';

    protected openEditDialog(title: string, id?: number): void
    {
        /*const modal = Sftoomi.Dialog.getInstance().create<PatientEditDialogComponent, PatientEditDialogData>({
            nzTitle: title,
            nzContent: PatientEditDialogComponent,
            nzViewContainerRef: this.viewContainerRef,
            nzMaskClosable: false,
            nzCentered: true,
            nzWidth: 400,
            nzData: { id: id }
        });

        modal.afterClose.subscribe((isSaved: boolean = false): void => {
            if (isSaved) {
                this.table.refresh();
            }
        });*/
    }
}
