import { ReactiveFormsModule } from '@angular/forms';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';

import FormFieldErrorTemplateComponent from '../../templates/form-field-error-template/form-field-error-template.component';

const AppComboImports = [
    ReactiveFormsModule, NzSelectComponent, NzOptionComponent,
    NzColDirective, NzFormLabelComponent, FormFieldErrorTemplateComponent,
    NzFormControlComponent, NzFormItemComponent, NzTooltipDirective
];

export default AppComboImports;
