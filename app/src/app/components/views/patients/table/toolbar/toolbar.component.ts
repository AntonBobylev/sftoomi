import { Component, Input } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';

import PatientsTableComponent from '../table.component';

@Component({
    selector: 'patients-table-toolbar',
    templateUrl: './toolbar.component.html',
    imports: [
        TuiButton
    ],
    styleUrl: './toolbar.component.scss'
})

export default class PatientsTableToolbarComponent
{
    @Input({required: true}) table!: PatientsTableComponent;

    protected onRefreshClick(): void
    {
        this.table.refresh();
    }
}
