import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageDescription } from '@codemirror/language';
import  { html } from '@codemirror/lang-html';
import { CodeEditor } from '@acrodata/code-editor';

import Sftoomi from '../../../class/Sftoomi';

import { SafePipe } from '../../../pipes/safe.pipe';

@Component({
    selector: 'template-module',
    templateUrl: './template.component.html',
    imports: [
        SafePipe,
        CodeEditor,
        FormsModule
    ],
    styleUrl: './template.component.less'
})

export default class TemplateComponent
{
    protected templateCode: string = this.getDefaultValue();
    protected readonly Sftoomi = Sftoomi;

    protected readonly languages: LanguageDescription[] = [
        LanguageDescription.of({ name: 'html', support: html() })
    ];

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
