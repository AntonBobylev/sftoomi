import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';

import Sftoomi from '../../../class/Sftoomi';

import AppBaseEditDialog from '../../../components/core/app-base-edit-dialog/app-base-edit-dialog';

import AppTextfieldComponent from '../../../components/core/app-textfield/app-textfield.component';
import AppComboComponent, { AppComboRecord } from '../../../components/core/app-combo/app-combo.component';

import getStudyAPI from '../../../APIs/getStudyAPI';

export type StudiesEditDialogData = {
    id?: number
};

@Component({
    selector: 'studies-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        FormsModule, ReactiveFormsModule,
        NzButtonComponent, NzModalFooterDirective,
        AppTextfieldComponent, AppComboComponent
    ],
    styleUrls: [
        './dialog.component.less',
        '../../../components/core/app-base-edit-dialog/app-base-edit-dialog.less'
    ]
})

export default class StudiesEditDialogComponent extends AppBaseEditDialog
{
    @ViewChild('studyCptsCtrl')
    protected studyCptsCtrl!: AppComboComponent;

    protected override readonly data: StudiesEditDialogData = inject(NZ_MODAL_DATA);

    protected override readonly fetchExtraRequestOnLoad: boolean = true;

    protected override readonly loadUrl: string = '/getStudy';
    protected override readonly saveUrl: string = '/saveStudy';

    protected override readonly width: number | string | undefined = parseInt(Sftoomi.Translator.translate('views.studies.dialog.width'));

    protected readonly form: FormGroup = new FormGroup({
        short_name: new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required]),
        full_name:  new FormControl<string | null>(null, [Validators.maxLength(255), Validators.required]),
        study_cpts: new FormControl<number[] | null>(null, [Validators.required])
    });

    protected afterLoad(data: getStudyAPI): void
    {
        if (Sftoomi.isEmpty(data.data.id)) {
            return;
        }

        this.form.get('short_name')?.setValue(data.data.short_name);
        this.form.get('full_name')?.setValue(data.data.full_name);

        this.studyCptsCtrl.setData(data.data.study_cpts);
        this.form.get('study_cpts')?.setValue(data.data.study_cpts.map((record: AppComboRecord): string | number => record.value));
    }
}
