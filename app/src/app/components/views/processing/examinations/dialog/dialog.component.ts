import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiDialogContext, TuiError, TuiLabel, TuiLoader, TuiTextfieldComponent } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { TuiInputDateModule } from '@taiga-ui/legacy';
import { TuiFieldErrorPipe, TuiInputNumberDirective } from '@taiga-ui/kit';
import { AsyncPipe } from '@angular/common';

import AppBaseEditDialog from '../../../../core/app-base-edit-dialog';

import PatientDemographicsTemplateComponent, { PatientDemographicsTemplateControls } from '../../../../templates/patient-demographics-template.component';

export type ExaminationEditDialogData = {
    id: number
};

@Component({
    selector: 'examination-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        ReactiveFormsModule, TuiButton,
        TuiLoader, TuiInputDateModule,
        PatientDemographicsTemplateComponent,
        TuiTextfieldComponent, AsyncPipe, TuiError,
        TuiFieldErrorPipe, TuiLabel, TuiInputNumberDirective
    ],
    styleUrls: [
        './dialog.component.scss',
        '../../../core/app-base-edit-dialog-with-tabs.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export default class ExaminationEditDialogComponent extends AppBaseEditDialog
{
    protected readonly context: TuiDialogContext<any, ExaminationEditDialogData> = injectContext<TuiDialogContext<any, ExaminationEditDialogData>>();

    protected readonly loadUrl: string = '//TODO:implementMe';
    protected readonly saveUrl: string = '//TODO:implementMe';

    protected readonly form: FormGroup = new FormGroup({
        patient_id:          new FormControl('', [Validators.min(1)]),
        patient_last_name:   new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]),
        patient_first_name:  new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]),
        patient_middle_name: new FormControl('', [Validators.minLength(2), Validators.maxLength(255)]),
        patient_dob:         new FormControl,
        patient_phone:       new FormControl('', [Validators.minLength(16), Validators.maxLength(16)])
    });

    protected afterLoad(data: any): void
    {
        // TODO: implement
    }

    protected getPatientTemplateControls(): PatientDemographicsTemplateControls
    {
        return {
            last_name:   this.form.get('patient_last_name') as FormControl,
            first_name:  this.form.get('patient_first_name') as FormControl,
            middle_name: this.form.get('patient_middle_name') as FormControl,
            dob:         this.form.get('patient_dob') as FormControl,
            phone:       this.form.get('patient_phone') as FormControl
        }
    }
}
