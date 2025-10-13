import { NgComponentOutlet, NgStyle } from '@angular/common'
import { NzTdAddOnComponent, NzThSelectionComponent } from 'ng-zorro-antd/table'
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip'

import { SafePipe } from '../../../../../pipes/safe.pipe'

let AppTableRowViewImports = [
    NzThSelectionComponent, NzTooltipDirective, NgStyle,
    NzTdAddOnComponent, NgComponentOutlet, SafePipe
];

export default AppTableRowViewImports;
