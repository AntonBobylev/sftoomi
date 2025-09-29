import { Component } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';

import Sftoomi from '../../../../class/Sftoomi';

import AppBaseToolbar from '../../../../components/core/app-base-toolbar';

@Component({
    selector: 'studies-table-toolbar',
    templateUrl: './toolbar.component.html',
    imports: [
        NzButtonComponent,
        NzIconDirective,
        NzTooltipDirective
    ]
})

export default class StudiesTableToolbarComponent extends AppBaseToolbar
{
    protected override readonly editDialogAddTitle: string = Sftoomi.Translator.translate('views.studies.dialog.add_title');
    protected override readonly editDialogEditTitle: string = Sftoomi.Translator.translate('views.studies.dialog.edit_title');

    protected override readonly removeUrl: string = '/removeStudy';

    protected openEditDialog(title: string, id?: number): void
    {
        /*const modal = Sftoomi.Dialog.getInstance().create<ReferringFacilityEditDialogComponent, ReferringFacilityEditDialogData>({
            nzTitle: title,
            nzContent: ReferringFacilityEditDialogComponent,
            nzViewContainerRef: this.viewContainerRef,
            nzMaskClosable: false,
            nzCentered: true,
            nzWidth: parseInt(Sftoomi.Translator.translate('views.studies.dialog.width')),
            nzData: { id: id }
        });

        modal.afterClose.subscribe((isSaved: boolean = false): void => {
            if (isSaved) {
                this.table.refresh();
            }
        });*/
    }
}
