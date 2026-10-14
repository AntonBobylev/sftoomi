import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzInputDirective, NzInputModule, NzInputWrapperComponent } from 'ng-zorro-antd/input';

import FormErrorTemplateComponent from '../../templates/form-error-template/form-error-template.component';

const AppTextFieldImports = [
    NzFormItemComponent, FormErrorTemplateComponent, NzColDirective,
    NzFormControlComponent, NzFormLabelComponent, ReactiveFormsModule,
    NzInputDirective, NzInputWrapperComponent,FormsModule, NzInputModule
];

export default AppTextFieldImports;
