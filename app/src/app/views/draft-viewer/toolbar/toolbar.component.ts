import { Component, input, InputSignal, output, OutputEmitterRef, Signal, viewChild } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { NzButtonComponent } from 'ng-zorro-antd/button'
import { NzIconDirective } from 'ng-zorro-antd/icon'

import Sftoomi from '../../../class/Sftoomi'

import AppComboComponent, { AppComboRecord } from '../../../components/core/app-combo/app-combo.component'

@Component({
    selector: 'app-draft-viewer-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrl: './toolbar.component.less',
    imports: [
        NzButtonComponent,
        NzIconDirective,
        AppComboComponent
    ]
})
export default class DraftViewerToolbarComponent
{
    public readonly form: InputSignal<FormGroup> = input.required();

    public readonly templateChanged: OutputEmitterRef<number> = output();
    public readonly goBack:          OutputEmitterRef<void> = output();

    protected readonly Sftoomi: typeof Sftoomi = Sftoomi;

    private readonly templateIdCtrl: Signal<AppComboComponent> = viewChild.required('templateIdCtrl');

    public setTemplatesStore(data: AppComboRecord[]): void
    {
        this.templateIdCtrl().setData(data);
    }

    protected onTemplateIdChange(selectedTemplateId: AppComboRecord['value']): void
    {
        let templateId: number;
        if (typeof selectedTemplateId === 'string') {
            templateId = parseInt(selectedTemplateId);
        } else {
            templateId = selectedTemplateId;
        }

        if (templateId < 1) {
            console.error(this.Sftoomi.format(
                this.Sftoomi.Translator.translate('views.draft_viewer.error_messages.template_id_must_be_greater_than_zero'),
                [
                    templateId
                ]
            ));

            return;
        }

        if (!isFinite(templateId)) {
            console.error(this.Sftoomi.format(
                this.Sftoomi.Translator.translate('views.draft_viewer.error_messages.template_id_is_not_finite'),
                [
                    templateId
                ]
            ));

            return;
        }

        this.templateChanged.emit(templateId);
    }
}
