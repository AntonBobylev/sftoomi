import { ReactiveFormsModule } from '@angular/forms';
import { NzInputDirective, NzInputWrapperComponent } from 'ng-zorro-antd/input';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';

import OnlyNumbersDirective from '../../../directives/only-numbers.directive';

import FormErrorTemplateComponent from '../../templates/form-error-template/form-error-template.component';

const AppNumberFieldImports = [
    NzFormItemComponent, FormErrorTemplateComponent,
    NzColDirective, NzFormControlComponent, NzFormLabelComponent,
    ReactiveFormsModule, NzInputWrapperComponent,
    NzInputDirective, OnlyNumbersDirective
];

export default AppNumberFieldImports;
