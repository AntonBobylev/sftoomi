import { NgComponentOutlet } from '@angular/common'
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox'

import { SafePipe } from '../../../../../pipes/safe.pipe'

const AppTableCardViewImports = [
    NzCheckboxComponent,
    SafePipe,
    NgComponentOutlet
];

export default AppTableCardViewImports;
