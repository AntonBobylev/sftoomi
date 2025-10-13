import { Component } from '@angular/core'

import AppTableCardViewImports from './imports'

import AppTableBaseView from '../base-view'

@Component({
    selector: 'app-table-card-view',
    templateUrl: './card.component.html',
    imports: [AppTableCardViewImports],
    styleUrls: [
        './card.component.less',
        '../base-view.less'
    ]
})

export default class AppTableCardViewComponent extends AppTableBaseView
{
}
