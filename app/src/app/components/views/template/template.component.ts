import { Component, signal, WritableSignal } from '@angular/core';
import { CodeEditorComponent, CodeModel } from '@ngstack/code-editor';

import Sftoomi from '../../../class/Sftoomi';

import { SafePipe } from '../../../pipes/safe.pipe';

@Component({
    selector: 'template-module',
    templateUrl: './template.component.html',
    imports: [
        CodeEditorComponent,
        SafePipe,
    ],
    styleUrl: './template.component.less'
})

export default class TemplateComponent
{
    protected readonly templateCode: WritableSignal<string> = signal<string>(this.getDefaultValue());
    protected readonly Sftoomi = Sftoomi;

    model: CodeModel = {
        language: 'html',
        uri: 'main.html',
        value: this.getDefaultValue()
    };

    options = {
        contextmenu: false,
        lineNumbers: true,
        minimap: {
            enabled: true,
        }
    };

    onCodeChanged(value: any): void
    {
        this.templateCode.set(value);
    }

    getDefaultValue(): string
    {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        .test {
            color: red;
        }
    </style>
</head>
    <body>
        <div class="test">test</div>
    </body>
</html>`;
    }
}
