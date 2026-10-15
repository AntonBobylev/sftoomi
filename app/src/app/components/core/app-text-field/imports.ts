import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaskitoDirective } from '@maskito/angular';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzInputDirective, NzInputModule, NzInputWrapperComponent } from 'ng-zorro-antd/input';

import FormFieldErrorTemplateComponent from '../../templates/form-field-error-template/form-field-error-template.component';

const AppTextFieldImports = [
    NzFormItemComponent, FormFieldErrorTemplateComponent, NzColDirective,
    NzFormControlComponent, NzFormLabelComponent, ReactiveFormsModule,
    NzInputDirective, NzInputWrapperComponent,FormsModule, NzInputModule,
    MaskitoDirective
];

export default AppTextFieldImports;
