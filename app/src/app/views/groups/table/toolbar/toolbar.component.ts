import { Component } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';

import Sftoomi from '../../../../class/Sftoomi';

import AppBaseToolbar from '../../../../components/core/app-base-toolbar';

@Component({
    selector: 'groups-table-toolbar',
    templateUrl: './toolbar.component.html',
    imports: [
        NzButtonComponent,
        NzIconDirective,
        NzTooltipDirective
    ]
})

export default class GroupsTableToolbarComponent extends AppBaseToolbar
{
    protected override readonly editDialogAddTitle: string  = Sftoomi.Translator.translate('views.groups.dialog.add_title');
    protected override readonly editDialogEditTitle: string = Sftoomi.Translator.translate('views.groups.dialog.edit_title');

    protected openEditDialog(title: string, id?: number): void
    {
        // TODO: implement
    }
}
