import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { TuiDialogContext, TuiError, TuiTextfield, TuiTextfieldComponent, TuiTextfieldDirective } from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { injectContext } from '@taiga-ui/polymorpheus';

import { onlyLettersValidator } from '../../../../validators/only-letters.validator';

import OnlyLettersDirective from '../../../../directives/only-letters.directive';
import UppercaseDirective from '../../../../directives/uppercase.directive';

export type PatientEditDialogData = {
    id: number
};

@Component({
    selector: 'patient-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        TuiTextfieldComponent, TuiTextfieldDirective,
        FormsModule, TuiTextfield, ReactiveFormsModule,
        OnlyLettersDirective, TuiError,
        TuiFieldErrorPipe, AsyncPipe, UppercaseDirective
    ],
    styleUrl: './dialog.component.scss'
})

export default class PatientEditDialogComponent
{
    public readonly context = injectContext<TuiDialogContext<PatientEditDialogData, PatientEditDialogData>>();

    protected readonly form: FormGroup = new FormGroup({
        first_name: new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()])
    });

    protected get data(): PatientEditDialogData
    {
        return this.context.data;
    }
}
