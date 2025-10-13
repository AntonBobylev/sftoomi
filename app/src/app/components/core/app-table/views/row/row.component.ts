import { Component } from '@angular/core'

import AppTableRowViewImports from './imports'

import AppTableBaseView from '../base-view'

@Component({
    selector: 'app-table-row-view',
    templateUrl: './row.component.html',
    imports: [AppTableRowViewImports],
    styleUrls: [
        './row.component.less',
        '../base-view.less'
    ]
})

export default class AppTableRowViewComponent extends AppTableBaseView
{
}
