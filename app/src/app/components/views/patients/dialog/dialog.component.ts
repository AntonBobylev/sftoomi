import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import {
    TuiDialogContext,
    TuiError,
    TuiLoader,
    TuiTextfield,
    TuiTextfieldComponent,
    TuiTextfieldDirective
} from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { injectContext } from '@taiga-ui/polymorpheus';

import Fetcher from '../../../../class/Fetcher';
import getPatientAPI from '../../../../APIs/getPatientAPI';

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
        TuiFieldErrorPipe, AsyncPipe, UppercaseDirective, TuiLoader
    ],
    styleUrl: './dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export default class PatientEditDialogComponent implements AfterViewInit
{
    public readonly context = injectContext<TuiDialogContext<PatientEditDialogData, PatientEditDialogData>>();

    protected isLoading: boolean = false;

    protected readonly form: FormGroup = new FormGroup({
        first_name: new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()])
    });

    protected get data(): PatientEditDialogData
    {
        return this.context.data;
    }

    ngAfterViewInit(): void
    {
        let me: this = this,
            data: FormData = new FormData();
        data.append('id', this.data.id.toString());

        me.isLoading = true;
        new Fetcher().request({
            url: 'http://localhost:8080/getPatient',
            data: data,
            success: function (_response: any, _request: any, data: getPatientAPI): void {
                me.isLoading = false;

                me.form.get('first_name')?.setValue(data.data.first_name);
            },
            failure: function (code: any, message: any, _request: any): void {
                me.isLoading = false;

                console.error(code);
                console.error(message);
            }
        })
    }
}
