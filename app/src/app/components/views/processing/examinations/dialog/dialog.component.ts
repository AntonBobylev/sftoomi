import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiDialogContext, TuiLoader } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';

import AppBaseEditDialog from '../../../../core/app-base-edit-dialog';

export type ExaminationEditDialogData = {
    id: number
};

@Component({
    selector: 'examination-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        ReactiveFormsModule, TuiButton, TuiLoader
    ],
    styleUrls: [
        './dialog.component.scss',
        '../../../core/app-base-edit-dialog-with-tabs.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export default class ExaminationEditDialogComponent extends AppBaseEditDialog
{
    protected readonly context: TuiDialogContext<any, ExaminationEditDialogData> = injectContext<TuiDialogContext<any, ExaminationEditDialogData>>();

    protected readonly loadUrl: string = '//TODO:implementMe';
    protected readonly saveUrl: string = '//TODO:implementMe';

    protected readonly form: FormGroup = new FormGroup({
        // TODO: implement
    });

    protected afterLoad(data: any): void
    {
        // TODO: implement
    }
}
