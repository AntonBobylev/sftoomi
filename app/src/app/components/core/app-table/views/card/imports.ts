import { NgComponentOutlet } from '@angular/common'
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox'

import { SafePipe } from '../../../../../pipes/safe.pipe'

let AppTableCardViewImports = [
    NzCheckboxComponent,
    SafePipe,
    NgComponentOutlet
];

export default AppTableCardViewImports;
