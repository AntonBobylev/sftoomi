import { Component } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';

import Sftoomi from '../../../../class/Sftoomi';

import AppBaseToolbar from '../../../../components/core/app-base-toolbar';

import PatientEditDialogComponent, { PatientEditDialogData } from '../../dialog/dialog.component';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';

@Component({
    selector: 'patients-table-toolbar',
    templateUrl: './toolbar.component.html',
    imports: [
        NzButtonComponent,
        NzIconDirective,
        NzTooltipDirective
    ]
})

export default class PatientsTableToolbarComponent extends AppBaseToolbar
{
    protected override readonly editDialogAddTitle: string = Sftoomi.Translator.translate('views.patients.dialog.add_title');
    protected override readonly editDialogEditTitle: string = Sftoomi.Translator.translate('views.patients.dialog.edit_title');

    protected openEditDialog(title: string, id?: number): void
    {
        const modal = Sftoomi.Dialog.getInstance().create<PatientEditDialogComponent, PatientEditDialogData>({
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
        });
    }
}
