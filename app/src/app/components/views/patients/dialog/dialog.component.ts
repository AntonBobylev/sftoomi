import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { TuiButton, TuiDialogContext, TuiError, TuiFlagPipe, TuiLoader, TuiTextfield, TuiTextfieldComponent, TuiTextfieldDirective } from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { injectContext } from '@taiga-ui/polymorpheus';
import { TuiInputDateModule, TuiInputModule, TuiTextfieldControllerModule, TuiUnfinishedValidator } from '@taiga-ui/legacy';
import { TUI_IS_IOS, TuiDay } from '@taiga-ui/cdk';
import { MaskitoDirective } from '@maskito/angular';
import { maskitoGetCountryFromNumber, maskitoPhoneOptionsGenerator } from '@maskito/phone';
import { MaskitoOptions } from '@maskito/core';
import metadata from 'libphonenumber-js/min/metadata';
import moment from 'moment';

import AppBaseEditDialog from '../../../core/app-base-edit-dialog';

import getPatientAPI from '../../../../APIs/getPatientAPI';

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
        TuiDateToNativeTransformerDirective, TuiButton, TuiInputModule,
        TuiTextfieldControllerModule, MaskitoDirective, TuiFlagPipe
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
        dob:         new FormControl<Date | null>(null),
        phone:       new FormControl<string | null>(null, [Validators.maxLength(16)])
    });

    private readonly isIos: boolean = inject(TUI_IS_IOS);

    protected readonly mask: Required<MaskitoOptions> = maskitoPhoneOptionsGenerator({
        metadata,
        strict: false,
        countryIsoCode: 'RU'
    });

    protected get countryIsoCode(): string {
        return maskitoGetCountryFromNumber(this.form.get('phone')?.value ?? '', metadata) ?? '';
    }

    protected get pattern(): string {
        return this.isIos ? '+[0-9-]{1,20}' : '';
    }

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
}
