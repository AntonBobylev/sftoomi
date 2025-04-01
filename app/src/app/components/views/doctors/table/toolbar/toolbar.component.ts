import { Component} from '@angular/core';
import { TuiButton, TuiHint } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { defaultIfEmpty } from 'rxjs';

import Sftoomi from '../../../../../class/Sftoomi';

import AppBaseToolbar from '../../../../core/app-base-toolbar';

import DoctorEditDialogComponent, { DoctorEditDialogData } from '../../dialog/dialog.component';

@Component({
    selector: 'doctors-table-toolbar',
    templateUrl: './toolbar.component.html',
    imports: [ TuiButton, TuiHint ],
    styleUrl: './toolbar.component.scss'
})

export default class DoctorsTableToolbarComponent extends AppBaseToolbar
{
    protected override readonly editDialogAddTitle: string = Sftoomi.Translator.translate('views.doctors.dialog.add_title');
    protected override readonly editDialogEditTitle: string = Sftoomi.Translator.translate('views.doctors.dialog.edit_title');

    protected override readonly removeUrl: string = '/removeDoctor';

    protected openEditDialog(title: string, id?: number): void
    {
        let me: this = this;
        this.dialog.open(new PolymorpheusComponent(DoctorEditDialogComponent  ), {
            label: title,
            data: {
                id: id
            } as DoctorEditDialogData
        })
            .pipe(defaultIfEmpty({saved: false}))
            .subscribe((result: any): void => {
                if (result?.saved) {
                    me.table.refresh();
                }
            });
    }
}
