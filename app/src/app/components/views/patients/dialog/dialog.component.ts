import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { TuiButton, TuiDialogContext, TuiError, TuiLoader, TuiTextfield, TuiTextfieldComponent, TuiTextfieldDirective } from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { injectContext } from '@taiga-ui/polymorpheus';
import { TuiInputDateModule, TuiUnfinishedValidator } from '@taiga-ui/legacy';
import { TuiDay } from '@taiga-ui/cdk';
import moment from 'moment';

import Sftoomi from '../../../../class/Sftoomi';

import Fetcher from '../../../../class/Fetcher';

import getPatientAPI from '../../../../APIs/getPatientAPI';
import savePatientAPI from '../../../../APIs/savePatientAPI';

import { onlyLettersValidator } from '../../../../validators/only-letters.validator';

import OnlyLettersDirective from '../../../../directives/only-letters.directive';
import UppercaseDirective from '../../../../directives/uppercase.directive';
import TuiDateToNativeTransformerDirective from '../../../../directives/tui-date-to-native.directive';
import PopupMsgService from '../../../../services/popup-msg.service';

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

export default class PatientEditDialogComponent implements AfterViewInit, OnDestroy
{
    public readonly context = injectContext<TuiDialogContext<PatientEditDialogData, PatientEditDialogData>>();

    protected isLoading: boolean = false;

    protected readonly maxDobDate: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    protected readonly TuiDay = TuiDay;
    protected readonly Sftoomi = Sftoomi;

    protected readonly form: FormGroup = new FormGroup({
        last_name:   new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()]),
        first_name:  new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()]),
        middle_name: new FormControl<string | null>(null, [Validators.maxLength(255), onlyLettersValidator()]),
        dob:         new FormControl<Date | null>(null)
    });

    private readonly popupMsg: PopupMsgService = inject(PopupMsgService);

    private readonly queryController: AbortController = new AbortController();

    protected get data(): PatientEditDialogData
    {
        return this.context.data;
    }

    ngAfterViewInit(): void
    {
        let me: this = this,
            data: FormData = new FormData();

        if (this.data.id) {
            data.append('id', this.data.id.toString());
        }

        me.isLoading = true;
        new Fetcher().request({
            url: 'http://localhost:8080/getPatient',
            data: data,
            signal: this.queryController.signal,
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

    ngOnDestroy(): void
    {
        this.queryController.abort();
    }

    protected savePatient(): void
    {
        if (this.form.invalid) {
            this.popupMsg.formInvalid();

            return;
        }

        let me: this = this,
            data: FormData = new FormData(),
            formValues: object = this.form.value;

        for (const [key, value] of Object.entries(formValues)) {
            let val: any = value;

            if (key === 'dob' && val instanceof Date) {
                val = Sftoomi.dateShort(value);
            }

            data.append(key, val);
        }

        if (this.data.id) {
            data.append('id', this.data.id.toString());
        }

        me.isLoading = true;
        new Fetcher().request({
            url: 'http://localhost:8080/savePatient',
            data: data,
            signal: this.queryController.signal,
            success: function (_response: any, _request: any, data: savePatientAPI): void {
                me.isLoading = false;

                me.context.completeWith({ id: data.id });
            },
            failure: function (code: any, message: any, _request: any): void {
                me.isLoading = false;

                console.error(code);
                console.error(message);
            }
        })
    }
}
