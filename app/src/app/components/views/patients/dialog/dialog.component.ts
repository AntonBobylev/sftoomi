import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { TuiButton, TuiDialogContext, TuiError, TuiLoader, TuiTextfield, TuiTextfieldComponent, TuiTextfieldDirective } from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { injectContext } from '@taiga-ui/polymorpheus';
import { TuiInputDateModule, TuiUnfinishedValidator } from '@taiga-ui/legacy';
import { TuiDay } from '@taiga-ui/cdk';
import moment from 'moment';

import AppBaseEditDialog from '../../../core/app-base-edit-dialog';

import getPatientAPI from '../../../../APIs/getPatientAPI';
import savePatientAPI from '../../../../APIs/savePatientAPI';

import { onlyLettersValidator } from '../../../../validators/only-letters.validator';

import OnlyLettersDirective from '../../../../directives/only-letters.directive';
import UppercaseDirective from '../../../../directives/uppercase.directive';
import TuiDateToNativeTransformerDirective from '../../../../directives/tui-date-to-native.directive';

export type PatientEditDialogData = {
    id?: number
};

@Component({
    selector: 'patient-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        TuiTextfieldComponent, TuiTextfieldDirective,
        FormsModule, TuiTextfield, ReactiveFormsModule,
        OnlyLettersDirective, TuiError,
        TuiFieldErrorPipe, AsyncPipe, UppercaseDirective, TuiLoader,
        TuiInputDateModule, TuiUnfinishedValidator,
        TuiDateToNativeTransformerDirective, TuiButton
    ],
    styleUrl: './dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export default class PatientEditDialogComponent extends AppBaseEditDialog
{
    protected readonly context: TuiDialogContext<any, PatientEditDialogData> = injectContext<TuiDialogContext<any, PatientEditDialogData>>();

    protected readonly maxDobDate: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    protected readonly TuiDay: typeof TuiDay = TuiDay;

    protected readonly loadUrl: string = '/getPatient';
    protected readonly saveUrl: string = '/savePatient';

    protected readonly form: FormGroup = new FormGroup({
        last_name:   new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()]),
        first_name:  new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()]),
        middle_name: new FormControl<string | null>(null, [Validators.maxLength(255), onlyLettersValidator()]),
        dob:         new FormControl<Date | null>(null)
    });

    protected afterSave(_data: savePatientAPI): void
    {
        this.context.completeWith({saved: true});
    }

    protected afterLoad(data: getPatientAPI): void
    {
        this.form.get('first_name')?.setValue(data.data.first_name.toUpperCase());
        this.form.get('last_name')?.setValue(data.data.last_name.toUpperCase());
        this.form.get('middle_name')?.setValue(data.data.middle_name.toUpperCase());
        this.form.get('dob')?.setValue(moment(data.data.dob.date).toDate());
    }
}
