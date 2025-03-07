import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiDialogContext, TuiError, TuiLabel, TuiLoader, TuiTextfieldComponent, TuiTextfieldDirective } from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { injectContext } from '@taiga-ui/polymorpheus';

import getStudyAPI from '../../../../APIs/getStudyAPI';

import AppRemoteMultiSelectComponent, { AppRemoteMultiSelectRecord } from '../../../fields/app-remote-multi-select/app-remote-multi-select.component';

import AppBaseEditDialog from '../../../core/app-base-edit-dialog';

import { onlyLettersValidator } from '../../../../validators/only-letters.validator';

import OnlyLettersDirective from '../../../../directives/only-letters.directive';

export type StudyEditDialogData = {
    id?: number
};

@Component({
    selector: 'study-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        AsyncPipe, OnlyLettersDirective, ReactiveFormsModule,
        TuiButton, TuiError, TuiFieldErrorPipe, TuiLabel,
        TuiLoader, TuiTextfieldComponent,
        TuiTextfieldDirective, AppRemoteMultiSelectComponent
    ],
    styleUrl: './dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export default class StudyEditDialogComponent extends AppBaseEditDialog
{
    protected readonly context: TuiDialogContext<any, StudyEditDialogData> = injectContext<TuiDialogContext<any, StudyEditDialogData>>();

    protected override readonly fetchExtraRequestOnLoad: boolean = true;

    protected readonly loadUrl: string = '/getStudy';
    protected readonly saveUrl: string = '/saveStudy';

    protected readonly form: FormGroup = new FormGroup({
        short_name: new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()]),
        full_name:  new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required, onlyLettersValidator()]),
        study_cpts: new FormControl(null, [Validators.required])
    });

    protected afterLoad(data: getStudyAPI): void
    {
        if (this.data.id) {
            this.form.get('short_name')?.setValue(data.data.short_name);
            this.form.get('full_name')?.setValue(data.data.full_name);
            this.form.get('study_cpts')?.setValue(data.data.study_cpts);
        }
    }

    protected override getAdditionalDataOnSave(data: FormData): FormData
    {
        let cpts: AppRemoteMultiSelectRecord[] | null = this.form.get('study_cpts')?.value;
        if (cpts) {
            let selectedCptsIds: number[] = cpts.map(function (cpt: AppRemoteMultiSelectRecord): number {
                return cpt.id;
            });

            data.append('study_cpts', selectedCptsIds.join(','));
        }

        return data;
    }
}
