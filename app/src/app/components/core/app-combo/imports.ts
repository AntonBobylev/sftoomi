import { ReactiveFormsModule } from '@angular/forms';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';

import FormErrorTemplateComponent from '../../templates/form-error-template/form-error-template.component';

const AppComboImports = [
    ReactiveFormsModule, NzSelectComponent, NzOptionComponent,
    NzColDirective, NzFormLabelComponent, FormErrorTemplateComponent,
    NzFormControlComponent, NzFormItemComponent, NzTooltipDirective
];

export default AppComboImports;
