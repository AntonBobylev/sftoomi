import { AfterViewInit, Component, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiLoader } from '@taiga-ui/core';

import Sftoomi from '../../../class/Sftoomi';

import Fetcher from '../../../class/Fetcher';

import { SafePipe } from '../../../pipes/safe.pipe';

import AppCodeEditorComponent from '../../fields/app-code-editor/app-code-editor.component';

@Component({
    selector: 'template-module',
    templateUrl: './template.component.html',
    imports: [
        SafePipe,
        FormsModule,
        AppCodeEditorComponent,
        TuiLoader
    ],
    styleUrl: './template.component.less'
})

export default class TemplateComponent implements AfterViewInit
{
    protected templateCode: string = '';

    protected readonly Sftoomi = Sftoomi;

    protected readonly isLoading: WritableSignal<boolean> = signal<boolean>(false);

    private readonly loadTemplateUrl: string = '/loadTemplate';
    private readonly defaultTemplateName: string = 'generic-freetext.html';

    ngAfterViewInit(): void
    {
        this.getDefaultValue();
    }

    getDefaultValue(): void
    {
        let data: FormData = new FormData();
        data.append('template_name', this.defaultTemplateName);

        this.isLoading.set(true);

        new Fetcher().request({
            url: this.loadTemplateUrl,
            data: data,
            success: (_response: any, _request: any, result: any): void  => {
                this.templateCode = result.data.template_code;
            },
            failure: (code: any, message: any, _request: any): void => {
                console.error(code);
                console.error(message);
            },
            finally: (): void => {
                this.isLoading.set(false);
            }
        });
    }
}
