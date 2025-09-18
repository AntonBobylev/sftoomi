import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiDialogContext, TuiError, TuiLabel, TuiLoader, TuiTextfieldComponent, TuiTextfieldDirective } from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { injectContext } from '@taiga-ui/polymorpheus';

import getStudyAPI from '../../../../APIs/getStudyAPI';

import AppBaseEditDialog from '../../../core/app-base-edit-dialog';
import getTemplateAPI from '../../../../APIs/getTemplateAPI';

export type TemplateEditDialogData = {
    id?: number
};

@Component({
    selector: 'study-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        AsyncPipe, ReactiveFormsModule,
        TuiButton, TuiError, TuiFieldErrorPipe, TuiLabel,
        TuiLoader, TuiTextfieldComponent,
        TuiTextfieldDirective
    ],
    styleUrl: './dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export default class TemplateEditDialogComponent extends AppBaseEditDialog
{
    protected readonly context: TuiDialogContext<any, TemplateEditDialogData> = injectContext<TuiDialogContext<any, TemplateEditDialogData>>();

    protected override readonly fetchExtraRequestOnLoad: boolean = true;

    protected readonly loadUrl: string = '/getTemplate';
    protected readonly saveUrl: string = '/saveTemplate';

    protected readonly form: FormGroup = new FormGroup({
        name:            new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required]),
        allowed_studies: new FormControl(null)
    });

    protected afterLoad(data: getTemplateAPI): void
    {
        // set studies library for combo

        if (this.data.id) {
           this.form.get('name')?.setValue(data.data.name);
           this.form.get('allowed_studies')?.setValue(data.data.allowed_studies);
        }
    }

    protected override getAdditionalDataOnSave(data: FormData): FormData
    {
        return data;
    }
}
