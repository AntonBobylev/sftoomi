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
import { TuiInputDateModule, TuiUnfinishedValidator } from '@taiga-ui/legacy';
import { TuiDay } from '@taiga-ui/cdk';
import moment from 'moment';

import Fetcher from '../../../../class/Fetcher';
import getPatientAPI from '../../../../APIs/getPatientAPI';

import { onlyLettersValidator } from '../../../../validators/only-letters.validator';

import OnlyLettersDirective from '../../../../directives/only-letters.directive';
import UppercaseDirective from '../../../../directives/uppercase.directive';
import TuiDateToNativeTransformerDirective from '../../../../directives/tui-date-to-native.directive';

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
        TuiFieldErrorPipe, AsyncPipe, UppercaseDirective, TuiLoader, TuiInputDateModule, TuiUnfinishedValidator, TuiDateToNativeTransformerDirective,
    ],
    styleUrl: './dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export default class PatientEditDialogComponent implements AfterViewInit
{
    public readonly context = injectContext<TuiDialogContext<PatientEditDialogData, PatientEditDialogData>>();

    protected isLoading: boolean = false;

    protected readonly maxDobDate: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    protected readonly TuiDay = TuiDay;

    protected readonly form: FormGroup = new FormGroup({
        last_name:   new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()]),
        first_name:  new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()]),
        middle_name: new FormControl<string | null>(null, [Validators.maxLength(255), onlyLettersValidator()]),
        dob:         new FormControl<Date | null>(null)
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

                me.form.get('first_name')?.setValue(data.data.first_name.toUpperCase());
                me.form.get('last_name')?.setValue(data.data.last_name.toUpperCase());
                me.form.get('middle_name')?.setValue(data.data.middle_name.toUpperCase());
                me.form.get('dob')?.setValue(moment(data.data.dob.date).toDate());
            },
            failure: function (code: any, message: any, _request: any): void {
                me.isLoading = false;

                console.error(code);
                console.error(message);
            }
        })
    }
}
