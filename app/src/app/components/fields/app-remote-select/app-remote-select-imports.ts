import { TuiComboBoxModule, TuiMultiSelectModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { TuiHintDirective, TuiLoader, TuiTextfieldOptionsDirective } from '@taiga-ui/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiCell } from '@taiga-ui/layout';
import { TuiValueChanges } from '@taiga-ui/cdk';

let AppRemoteSelectImports = [
    TuiMultiSelectModule, TuiTextfieldOptionsDirective,
    TuiTextfieldControllerModule, ReactiveFormsModule,
    TuiCell, TuiHintDirective, TuiValueChanges, TuiComboBoxModule, TuiLoader
];

export default AppRemoteSelectImports;
