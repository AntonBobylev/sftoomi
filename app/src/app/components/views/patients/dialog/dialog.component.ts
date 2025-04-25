import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiDialogContext, TuiLoader } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { TuiInputDateModule, TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import moment from 'moment';

import AppBaseEditDialog from '../../../core/app-base-edit-dialog';

import PatientDemographicsTemplateComponent, { PatientDemographicsTemplateControls } from '../../../templates/patient-demographics-template.component';

import getPatientAPI from '../../../../APIs/getPatientAPI';

import { onlyLettersValidator } from '../../../../validators/only-letters.validator';

export type PatientEditDialogData = {
    id?: number
};

@Component({
    selector: 'patient-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        FormsModule, ReactiveFormsModule, TuiLoader,
        TuiInputDateModule, TuiButton, TuiInputModule,
        TuiTextfieldControllerModule, PatientDemographicsTemplateComponent
    ],
    styleUrl: './dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export default class PatientEditDialogComponent extends AppBaseEditDialog
{
    protected readonly context: TuiDialogContext<any, PatientEditDialogData> = injectContext<TuiDialogContext<any, PatientEditDialogData>>();

    protected override readonly fetchExtraRequestOnLoad: boolean = true;

    protected readonly loadUrl: string = '/getPatient';
    protected readonly saveUrl: string = '/savePatient';

    protected readonly form: FormGroup = new FormGroup({
        last_name:   new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()]),
        first_name:  new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()]),
        middle_name: new FormControl<string | null>(null, [Validators.maxLength(255), onlyLettersValidator()]),
        dob:         new FormControl<Date | null>(null),
        phone:       new FormControl<string | null>(null, [Validators.maxLength(16)])
    });
    protected afterLoad(data: getPatientAPI): void
    {
        if (this.data.id) {
            this.form.get('first_name')?.setValue(data.data.first_name.toUpperCase());
            this.form.get('last_name')?.setValue(data.data.last_name.toUpperCase());
            this.form.get('middle_name')?.setValue(data.data.middle_name.toUpperCase());
            this.form.get('phone')?.setValue(data.data.phone);

            if (data.data.dob) {
                this.form.get('dob')?.setValue(moment(data.data.dob).toDate());
            }
        }
    }

    protected getPatientTemplateControls(): PatientDemographicsTemplateControls
    {
        return {
            last_name:   this.form.get('last_name') as FormControl,
            first_name:  this.form.get('first_name') as FormControl,
            middle_name: this.form.get('middle_name') as FormControl,
            dob:         this.form.get('dob') as FormControl,
            phone:       this.form.get('phone') as FormControl
        }
    }
}
