import { Component} from '@angular/core';
import { TuiButton, TuiHint } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { defaultIfEmpty } from 'rxjs';

import Sftoomi from '../../../../../class/Sftoomi';

import AppBaseToolbar from '../../../../core/app-base-toolbar';

import FacilityEditDialogComponent, { FacilityEditDialogData } from '../../dialog/dialog.component';

@Component({
    selector: 'patients-table-toolbar',
    templateUrl: './toolbar.component.html',
    imports: [ TuiButton, TuiHint ],
    styleUrl: './toolbar.component.scss'
})

export default class FacilitiesTableToolbarComponent extends AppBaseToolbar
{
    protected onRefreshClick(): void
    {
        this.table.refresh();
    }

    protected onAddClick(event: MouseEvent): void
    {
        event.stopPropagation();

        this.openFacilityEditDialog(Sftoomi.Translator.translate('views.facilities.dialog.add_title'));
    }

    protected onEditClick(event: MouseEvent): void
    {
        event.stopPropagation();

        let selectedRecords: any[] = this.table.getSelection();
        if (selectedRecords.length < 1) {
            this.popupMsg.nothingSelected();

            return;
        }

        if (selectedRecords.length > 1) {
            this.popupMsg.moreThanOneSelected();

            return;
        }

        // TODO: maybe replace code above in parent?

        let id: number = selectedRecords[0].id;
        this.openFacilityEditDialog(
            Sftoomi.format(Sftoomi.Translator.translate('views.facilities.dialog.edit_title'), [id]),
            id
        );
    }

    private openFacilityEditDialog(title: string, id?: number): void
    {
        let me: this = this;
        this.dialog.open(new PolymorpheusComponent(FacilityEditDialogComponent  ), {
            label: title,
            dismissible: false,
            size: 'auto',
            data: {
                id: id
            } as FacilityEditDialogData
        })
            .pipe(defaultIfEmpty({saved: false}))
            .subscribe((result: any): void => {
                if (result?.saved) {
                    me.table.refresh();
                }
            });
    }
}
