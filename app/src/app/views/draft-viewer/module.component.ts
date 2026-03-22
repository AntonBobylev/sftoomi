import { AfterViewInit, Component, inject, Signal, signal, viewChild, WritableSignal } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router'
import { FormControl, FormGroup } from '@angular/forms'

import Fetcher from '../../class/Fetcher'
import { DialogType } from '../../class/Dialog'

import AppBaseModule from '../../components/core/app-base-module'

import { RoutesPaths } from '../../app.routes'

import DraftViewerToolbarComponent from './toolbar/toolbar.component'
import AppLoadingSpinnerComponent from '../../components/misc/app-loading-spinner/app-loading-spinner.component'
import { AppComboRecord } from '../../components/core/app-combo/app-combo.component'

import { SafePipe } from '../../pipes/safe.pipe'

import getDraftViewerData from '../../APIs/getDraftViewerData'
import getDraftViewerTemplateData from '../../APIs/getDraftViewerTemplateData'

@Component({
    selector: 'app-draft-viewer',
    templateUrl: './module.component.html',
    imports: [
        DraftViewerToolbarComponent,
        SafePipe,
        AppLoadingSpinnerComponent
    ],
    styleUrl: './module.component.less'
})

export default class DraftViewerModuleComponent extends AppBaseModule implements AfterViewInit
{
    protected override permission: string | null = 'EXAMINATIONS_MODULE::EDIT_DRAFT';

    protected readonly form: FormGroup = new FormGroup({
        template_id: new FormControl
    });

    protected readonly draftTemplateCode: WritableSignal<string | null> = signal(null);

    protected readonly isLoading: WritableSignal<boolean> = signal(false);

    private readonly loadUrl: string = '/getDraftViewerData';
    private readonly loadTemplateUrl: string = '/getDraftViewerTemplateData';

    private readonly toolbarCtrl: Signal<DraftViewerToolbarComponent> = viewChild.required('toolbarCtrl');

    private examId: number | null = null;

    private readonly route: ActivatedRoute = inject(ActivatedRoute);

    ngAfterViewInit(): void
    {
        this.route.queryParams.subscribe((params: Params): void => {
            const exam: any = params['exam'];

            let errorMessage: string | null = null,
                examId:       number        = 0;

            if (this.Sftoomi.isEmpty(exam)) {
                errorMessage = this.Sftoomi.Translator.translate('views.draft_viewer.error_messages.exam_id_required');
            } else {
                examId = parseInt(exam);

                if (!isFinite(examId) && examId < 1) {
                    errorMessage = this.Sftoomi.Translator.translate('views.draft_viewer.error_messages.exam_id_is_incorrect');
                }
            }

            if (errorMessage) {
                this.Sftoomi.Dialog.show(
                    errorMessage,
                    DialogType.ERROR
                );

                return;
            }

            this.examId = examId;

            this.loadData();
        });
    }

    protected goBack(): void
    {
        const encodedRoute: string | null = this.route.snapshot.queryParamMap.get('back_route');

        if (encodedRoute) {
            try {
                const decodedUrl: string = atob(encodedRoute);

                this.router.navigateByUrl(decodedUrl).then();
            } catch (e) {
                this.router.navigate([RoutesPaths.HOME]).then();
            }
        } else {
            this.router.navigate([RoutesPaths.HOME]).then();
        }
    }

    protected onTemplateChanged(templateId: number): void
    {
        if (templateId < 1) {
            this.Sftoomi.Dialog.show(
                this.Sftoomi.format(
                    this.Sftoomi.Translator.translate('views.draft_viewer.error_messages.template_id_must_be_greater_than_zero'),
                    [
                        templateId
                    ]
                ),
                DialogType.ERROR
            );

            return;
        }

        this.loadTemplateData(templateId);
    }

    private loadData(): void
    {
        if (!this.examId) {
            this.Sftoomi.Dialog.show(
                this.Sftoomi.Translator.translate('views.draft_viewer.error_messages.exam_id_required'),
                DialogType.ERROR
            );

            return;
        }

        let data: FormData = new FormData();
        data.append('exam_id', this.examId.toString());

        this.isLoading.set(true);
        new Fetcher().request({
            url: this.loadUrl,
            data: data,
            success: (_response: any, _request: any, result: getDraftViewerData): void => {
                let templatesStore: AppComboRecord[] = result.lists.templates.map((template): AppComboRecord => ({
                    caption: this.Sftoomi.format('(ID #{0}): {1}', [template.id, template.name]),
                    value:   template.id
                }));

                this.toolbarCtrl().setTemplatesStore(templatesStore);

                if (this.Sftoomi.isEmpty(templatesStore)) {
                    this.isLoading.set(false);

                    return;
                }

                const lastId:    number | null              = result.data.last_edited_draft_template_id,
                      exists:    AppComboRecord | undefined = templatesStore.find(t => t.value == lastId),
                      initialId: string | number | null     = exists ? lastId : templatesStore[0].value;

                this.form.get('template_id')?.setValue(initialId);
            },
            failure: (_code: any, message: any, _request: any): void => {
                this.Sftoomi.Dialog.show(message, DialogType.ERROR);
                this.isLoading.set(false);
            }
        });
    }

    private loadTemplateData(templateId: number): void
    {
        if (!this.examId) {
            this.Sftoomi.Dialog.show(
                this.Sftoomi.Translator.translate('views.draft_viewer.error_messages.exam_id_required'),
                DialogType.ERROR
            );

            return;
        }

        const data: FormData = new FormData();
        data.append('template_id', templateId.toString());
        data.append('exam_id', this.examId.toString());

        this.isLoading.set(true);
        new Fetcher().request({
            url: this.loadTemplateUrl,
            data: data,
            success: (_response: any, _request: any, result: getDraftViewerTemplateData): void => {
                this.draftTemplateCode.set(result.data.template_content);
            },
            failure: (_code: any, message: any, _request: any): void => {
                this.Sftoomi.Dialog.show(message, DialogType.ERROR);
            },
            finally: (): void => {
                this.isLoading.set(false);
            }
        })
    }
}
