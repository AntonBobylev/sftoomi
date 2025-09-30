import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';

import Sftoomi from '../../../class/Sftoomi';

import AppBaseEditDialog from '../../../components/core/app-base-edit-dialog';
import AppDatepickerComponent from '../../../components/core/app-datepicker/app-datepicker.component';

export type ExaminationEditDialogData = {
    id?: number
};

@Component({
    selector: 'examination-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        FormsModule, ReactiveFormsModule,
        NzButtonComponent, NzModalFooterDirective,
        AppDatepickerComponent
    ],
    styleUrl: './dialog.component.less'
})

export default class ExaminationEditDialogComponent extends AppBaseEditDialog
{
    protected override readonly data: ExaminationEditDialogData = inject(NZ_MODAL_DATA);

    protected override readonly fetchExtraRequestOnLoad: boolean = true;

    protected readonly loadUrl: string = '/getExamination';
    protected readonly saveUrl: string = '/saveExamination';

    protected readonly form: FormGroup = new FormGroup({
        date: new FormControl<Date | null>(null, [Validators.required])
    });

    protected afterLoad(data: any): void
    {
        if (!data.data) {
            return;
        }

        this.form.get('date')?.setValue(Sftoomi.stringToDate(data.data.date));
    }
}
