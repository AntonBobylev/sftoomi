import { Component} from '@angular/core';
import { TuiButton, TuiHint } from '@taiga-ui/core';

import AppBaseToolbar from '../../../../core/app-base-toolbar';

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
}
