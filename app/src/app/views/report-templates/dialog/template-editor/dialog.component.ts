import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, Signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NuMonacoEditorComponent } from '@ng-util/monaco-editor'
import { NZ_MODAL_DATA, NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button'

import Fetcher from '../../../../class/Fetcher'
import { DialogType } from '../../../../class/Dialog'
import AppBaseDialog from '../../../../components/core/app-base-dialog'

import { SafePipe } from '../../../../pipes/safe.pipe'

import AppLoadingSpinnerComponent from '../../../../components/misc/app-loading-spinner/app-loading-spinner.component'
import AppComboComponent, { AppComboRecord } from '../../../../components/core/app-combo/app-combo.component'
import AppPdfViewerDialogComponent, { AppPdfViewerDialogIn } from '../../../../components/misc/app-pdf-viewer/dialog/dialog.component'

import previewTemplateAPI from '../../../../APIs/previewTemplateAPI'

import GenericTemplate from '../../../../type/GenericTemplate'

export type ReportTemplateEditorData = {
    content?: string,
    lists: {
        generic_templates: GenericTemplate[]
    }
};

export type ReportTemplateEditorOut = {
    is_saved: boolean,
    content:  string
};

@Component({
    selector: 'report-template-editor-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        FormsModule, ReactiveFormsModule,
        NzButtonComponent, NzModalFooterDirective,
        AppLoadingSpinnerComponent, AppComboComponent, SafePipe, NuMonacoEditorComponent
    ],
    styleUrls: [
        './dialog.component.less',
        '../../../../components/core/app-base-edit-dialog/app-base-edit-dialog.less'
    ]
})

export default class ReportTemplateEditorComponent extends AppBaseDialog implements AfterViewInit
{
    protected override readonly data: ReportTemplateEditorData = inject(NZ_MODAL_DATA);

    protected readonly form: FormGroup = new FormGroup({
        based_on: new FormControl<AppComboRecord | null>(null)
    });

    protected content: string = '';

    protected override readonly width: number | string | undefined = this.Sftoomi.Translator.translate('dialogs.template_editor.width');
    protected override readonly title: string = this.Sftoomi.Translator.translate('dialogs.template_editor.title');

    protected editorWidth: number = 50; // in percents
    protected isResizing: boolean = false;

    private readonly basedOnCtrl: Signal<AppComboComponent> = viewChild.required('basedOnCtrl');
    private readonly previewFrameCtrl: Signal<ElementRef<HTMLIFrameElement>> = viewChild.required('previewFrameCtrl');

    private readonly previewUrl: string = '/previewTemplate';

    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    ngAfterViewInit(): void
    {
        this.isLoading.set(true);

        this.basedOnCtrl().setData(this.data.lists.generic_templates.map((template: GenericTemplate): AppComboRecord => ({
            caption: template.name,
            value:   template.filename
        })));

        this.content = this.data.content ?? '';

        setTimeout((): void => {
            this.cdr.detectChanges();
            window.dispatchEvent(new Event('resize'));

            this.isLoading.set(false);
        }, 50);
    }

    protected override close(saved: boolean = false): void
    {
        super.close({
            is_saved: saved,
            content:  this.content
        } as ReportTemplateEditorOut);
    }

    protected onBasedOnChanged(value: AppComboRecord['value']): void
    {
        if (typeof value === 'number') {
            // something strange happened
            // it must be string
            return;
        }

        let selectedTemplate: GenericTemplate | undefined;
        this.data.lists.generic_templates.forEach((template: GenericTemplate): void => {
            if (template.filename === value) {
                selectedTemplate = template;

                return;
            }
        });

        if (!selectedTemplate) {
            return;
        }

        // TODO: add confirmation here
        this.content = selectedTemplate.content;
    }

    protected startResizing(event: MouseEvent): void
    {
        event.preventDefault();
        this.isResizing = true;

        const startX: number = event.clientX,
              startWidth: number = this.editorWidth;

        const container: HTMLElement | null = (event.currentTarget as HTMLElement).parentElement;
        const containerWidth: number = container?.offsetWidth || 1;

        const onMouseMove = (moveEvent: MouseEvent): void => {
            const deltaX: number = moveEvent.clientX - startX,
                  deltaPercent: number = (deltaX / containerWidth) * 100;

            this.editorWidth = Math.min(Math.max(10, startWidth + deltaPercent), 90);

            this.cdr.detectChanges();
            window.dispatchEvent(new Event('resize'));
        };

        const onMouseUp = (): void => {
            this.isResizing = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            this.cdr.detectChanges();
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    protected onPreview(): void
    {
        let data: FormData = new FormData();
        data.append('template_code', this.getPreviewIframeHtmlWithValues());

        this.queryController.abort();
        this.queryController = new AbortController();

        this.isLoading.set(true);
        new Fetcher().request({
            url: this.previewUrl,
            signal: this.queryController.signal,
            data: data,
            success: (_response: any, _request: any, data: previewTemplateAPI): void => {
                if (!data.encoded_pdf) {
                    this.Sftoomi.Dialog.show(data.error + '<br/>' + data.output, DialogType.ERROR)

                    return;
                }

                this.Sftoomi.Dialog.getInstance().create<AppPdfViewerDialogComponent, AppPdfViewerDialogIn>({
                    nzContent: AppPdfViewerDialogComponent,
                    nzViewContainerRef: this.viewContainerRef,
                    nzData: {
                        src: this.Sftoomi.Constants.encodedPdfBase64Prefix + data.encoded_pdf
                    }
                });
            },
            failure: (_code: any, message: any, _request: any): void => {
                if (message === 'canceled') {
                    return;
                }

                this.Sftoomi.Dialog.show(message, DialogType.ERROR)
            },
            finally: (): void => {
                this.isLoading.set(false);
            }
        })
    }

    private getPreviewIframeHtmlWithValues(): string
    {
        const iframe: HTMLIFrameElement = this.previewFrameCtrl().nativeElement;

        const sourceDoc: Document | null | undefined =
            iframe.contentDocument ?? iframe.contentWindow?.document;

        if (!sourceDoc) {
            return '';
        }

        const clonedHtmlEl: HTMLElement = sourceDoc.documentElement.cloneNode(true) as HTMLElement,
              applyPrintFieldStyles = (div: HTMLDivElement): void => {
                  div.style.whiteSpace = 'pre-wrap';
                  div.style.wordBreak = 'break-word';
                  div.style.padding = '8px';
                  div.style.fontFamily = 'Arial, sans-serif';
                  div.style.fontSize = '14px';
                  div.style.lineHeight = '1.4';
                  div.style.width = '100%';
                  div.style.boxSizing = 'border-box';
              },
              replaceWithDiv = (el: Element, text: string): void => {
                  const div: HTMLDivElement = sourceDoc.createElement('div');
                  div.textContent = text ?? '';
                  applyPrintFieldStyles(div);

                  el.replaceWith(div);
              };

        const srcTextAreas: HTMLTextAreaElement[] = Array.from(sourceDoc.querySelectorAll('textarea')),
              dstTextAreas: HTMLTextAreaElement[] = Array.from(clonedHtmlEl.querySelectorAll('textarea'));

        srcTextAreas.forEach((srcEl: HTMLTextAreaElement, i: number): void => {
            const dstEl = dstTextAreas[i] as HTMLTextAreaElement | undefined;
            if (!dstEl) {
                return;
            }

            replaceWithDiv(dstEl, srcEl.value ?? '');
        });

        const srcInputs: HTMLInputElement[] = Array.from(sourceDoc.querySelectorAll('input')),
              dstInputs: HTMLInputElement[] = Array.from(clonedHtmlEl.querySelectorAll('input'));

        srcInputs.forEach((srcEl: HTMLInputElement, i: number): void => {
            const dstEl = dstInputs[i] as HTMLInputElement | undefined;
            if (!dstEl) {
                return;
            }

            const type: string = (srcEl.getAttribute('type') ?? 'text').toLowerCase();

            if (type === 'checkbox') {
                replaceWithDiv(dstEl, srcEl.checked ? '☑' : '☐');
                return;
            }

            if (type === 'radio') {
                replaceWithDiv(dstEl, srcEl.checked ? '◉' : '○');

                return;
            }

            replaceWithDiv(dstEl, srcEl.value ?? '');
        });

        const srcSelects: HTMLSelectElement[] = Array.from(sourceDoc.querySelectorAll('select')),
              dstSelects: HTMLSelectElement[] = Array.from(clonedHtmlEl.querySelectorAll('select'));

        srcSelects.forEach((srcEl: HTMLSelectElement, i: number): void => {
            const dstEl = dstSelects[i] as HTMLSelectElement | undefined;
            if (!dstEl) {
                return;
            }

            const selectedText: string = srcEl.selectedOptions?.[0]?.text ?? '';
            replaceWithDiv(dstEl, selectedText);
        });

        return '<!DOCTYPE html>\n' + clonedHtmlEl.outerHTML;
    }
}
