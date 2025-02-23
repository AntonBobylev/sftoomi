import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiDialogContext, TuiError, TuiLabel, TuiLoader, TuiTextfieldComponent, TuiTextfieldDirective } from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { injectContext } from '@taiga-ui/polymorpheus';

import AppBaseEditDialog from '../../../core/app-base-edit-dialog';

import getDoctorAPI from '../../../../APIs/getDoctorAPI';

import { onlyLettersValidator } from '../../../../validators/only-letters.validator';

import OnlyLettersDirective from '../../../../directives/only-letters.directive';

export type DoctorEditDialogData = {
    id?: number
};

@Component({
    selector: 'doctor-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        AsyncPipe, OnlyLettersDirective, ReactiveFormsModule,
        TuiButton, TuiError, TuiFieldErrorPipe, TuiLabel,
        TuiLoader, TuiTextfieldComponent, TuiTextfieldDirective
    ],
    styleUrl: './dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export default class DoctorEditDialogComponent extends AppBaseEditDialog
{
    protected readonly context: TuiDialogContext<any, DoctorEditDialogData> = injectContext<TuiDialogContext<any, DoctorEditDialogData>>();

    protected readonly loadUrl: string = '/getDoctor';
    protected readonly saveUrl: string = '/saveDoctor';

    protected readonly form: FormGroup = new FormGroup({
        last_name:   new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()]),
        first_name:  new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()]),
        middle_name: new FormControl<string | null>(null, [Validators.maxLength(255), onlyLettersValidator()])
    });

    protected afterLoad(data: getDoctorAPI): void
    {
        this.form.get('last_name')?.setValue(data.data.last_name);
        this.form.get('first_name')?.setValue(data.data.first_name);
        this.form.get('middle_name')?.setValue(data.data.middle_name);
    }
}
