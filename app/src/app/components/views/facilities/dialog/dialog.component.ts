import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiDialogContext, TuiError, TuiLabel, TuiLoader, TuiTextfieldComponent, TuiTextfieldDirective } from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { injectContext } from '@taiga-ui/polymorpheus';

import AppBaseEditDialog from '../../../core/app-base-edit-dialog';

import getFacilityAPI from '../../../../APIs/getFacilityAPI';

import { onlyLettersValidator } from '../../../../validators/only-letters.validator';

import OnlyLettersDirective from '../../../../directives/only-letters.directive';

export type FacilityEditDialogData = {
    id?: number
};

@Component({
    selector: 'facility-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        AsyncPipe, OnlyLettersDirective, ReactiveFormsModule,
        TuiButton, TuiError, TuiFieldErrorPipe, TuiLabel,
        TuiLoader, TuiTextfieldComponent, TuiTextfieldDirective
    ],
    styleUrl: './dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export default class FacilityEditDialogComponent extends AppBaseEditDialog
{
    protected readonly context: TuiDialogContext<any, FacilityEditDialogData> = injectContext<TuiDialogContext<any, FacilityEditDialogData>>();

    protected readonly loadUrl: string = '/getFacility';
    protected readonly saveUrl: string = '/saveFacility';

    protected readonly form: FormGroup = new FormGroup({
        short_name: new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()]),
        full_name:  new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()])
    });

    protected afterLoad(data: getFacilityAPI): void
    {
        if (this.data.id) {
            this.form.get('short_name')?.setValue(data.data.short_name);
            this.form.get('full_name')?.setValue(data.data.full_name);
        }
    }
}
