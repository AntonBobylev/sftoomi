import { Component, inject, Signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button'

import AppBaseEditDialog from '../../../components/core/app-base-edit-dialog/app-base-edit-dialog';

import AppTextfieldComponent from '../../../components/core/app-textfield/app-textfield.component'
import AppLoadingSpinnerComponent from '../../../components/misc/app-loading-spinner/app-loading-spinner.component'
import AppComboComponent, { AppComboRecord } from '../../../components/core/app-combo/app-combo.component'
import ReportTemplateEditorComponent, { ReportTemplateEditorData } from './template-editor/dialog.component'

import getTemplateAPI from '../../../APIs/getTemplateAPI'
import Study from '../../../type/Study'
import GenericTemplate from '../../../type/GenericTemplate'

export type ReportTemplateEditDialogData = {
    id?: number
};

@Component({
    selector: 'report-template-edit-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        FormsModule, ReactiveFormsModule,
        AppTextfieldComponent, NzButtonComponent, NzModalFooterDirective,
        AppLoadingSpinnerComponent, AppComboComponent
    ],
    styleUrls: [
        './dialog.component.less',
        '../../../components/core/app-base-edit-dialog/app-base-edit-dialog.less'
    ]
})

export default class ReportTemplateEditDialogComponent extends AppBaseEditDialog
{
    protected override readonly data: ReportTemplateEditDialogData = inject(NZ_MODAL_DATA);

    protected override readonly fetchExtraRequestOnLoad: boolean = true;

    protected override readonly loadUrl: string = '/getTemplate';
    protected override readonly saveUrl: string = '/saveTemplate';

    protected override readonly addPermission: string | undefined = 'REPORT_TEMPLATES_MODULE::ADD';
    protected override readonly editPermission: string | undefined = 'REPORT_TEMPLATES_MODULE::EDIT';

    protected readonly form: FormGroup = new FormGroup({
        template_name:    new FormControl<string | null>(null, [Validators.required, Validators.maxLength(255)]),
        allowed_studies:  new FormControl<AppComboRecord[]>([]),
        template_content: new FormControl<string>('')
    });

    protected override readonly width: number | string | undefined = this.Sftoomi.Translator.translate('views.report_templates.dialog.width');

    private readonly allowedStudiesCtrl: Signal<AppComboComponent> = viewChild.required('allowedStudiesCtrl');

    private genericTemplatesList: GenericTemplate[] = [];

    protected afterLoad(data: getTemplateAPI): void
    {
        this.allowedStudiesCtrl().setData(data.lists.studies.map((study: Study): AppComboRecord => {
            return {
                caption: study.short_name,
                value:   study.id
            }
        }));

        this.genericTemplatesList = data.lists.generic_templates;

        this.form.get('template_name')?.setValue(data.data.name);
        this.form.get('allowed_studies')?.setValue(data.data.allowed_studies);
    }

    protected onEditContent(): void
    {
        const modal = this.Sftoomi.Dialog.getInstance().create<ReportTemplateEditorComponent, ReportTemplateEditorData>({
            nzContent: ReportTemplateEditorComponent,
            nzViewContainerRef: this.viewContainerRef,
            nzData: {
                content: this.form.get('template_content')?.value,
                lists: {
                    generic_templates: this.genericTemplatesList
                }
            }
        });

        modal.afterClose.subscribe((result?: { is_saved: boolean, content: string }): void => {
            if (!result || !result.is_saved) {
                return;
            }

            this.form.get('template_content')?.setValue(result.content);
        });
    }
}
