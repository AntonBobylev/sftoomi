import { Component} from '@angular/core';
import { TuiButton, TuiHint } from '@taiga-ui/core';

import Sftoomi from '../../../../../class/Sftoomi';

import AppBaseToolbar from '../../../../core/app-base-toolbar';

@Component({
    selector: 'templates-module-table-toolbar',
    templateUrl: './toolbar.component.html',
    imports: [ TuiButton, TuiHint ],
    styleUrl: './toolbar.component.scss'
})

export default class TemplatesModuleTableToolbarComponent extends AppBaseToolbar
{
    protected override readonly editDialogAddTitle: string = Sftoomi.Translator.translate('views.templates.dialog.add_title');
    protected override readonly editDialogEditTitle: string = Sftoomi.Translator.translate('views.templates.dialog.edit_title');

    protected override readonly removeUrl: string = '/removeTemplate';

    protected openEditDialog(title: string, id?: number): void
    {
        // TODO: implement

        // let me: this = this;
        // this.dialog.open(new PolymorpheusComponent(FacilityEditDialogComponent  ), {
        //     label: title,
        //     data: {
        //         id: id
        //     } as FacilityEditDialogData
        // })
        //     .pipe(defaultIfEmpty({saved: false}))
        //     .subscribe((result: any): void => {
        //         if (result?.saved) {
        //             me.table.refresh();
        //         }
        //     });
    }
}
