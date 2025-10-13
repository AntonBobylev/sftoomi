import { NgComponentOutlet } from '@angular/common';
import { NzTableComponent} from 'ng-zorro-antd/table';

import AppTableRowViewImports from './views/row/imports'
import AppTableCardViewImports from './views/card/imports'

import AppTableRowViewComponent from './views/row/row.component'
import AppTableCardViewComponent from './views/card/card.component'

export default [
    NgComponentOutlet,
    NzTableComponent,
    AppTableCardViewComponent,
    AppTableRowViewComponent,
    AppTableRowViewImports,
    AppTableCardViewImports
]
