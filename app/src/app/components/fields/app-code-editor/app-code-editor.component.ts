import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageDescription } from '@codemirror/language';
import { html } from '@codemirror/lang-html';
import { CodeEditor } from '@acrodata/code-editor';

import Sftoomi from '../../../class/Sftoomi';

@Component({
    selector: 'app-code-editor',
    templateUrl: './app-code-editor.component.html',
    imports: [
        CodeEditor,
        FormsModule
    ],
    styleUrl: './app-code-editor.component.less'
})

export default class AppCodeEditorComponent
{
    @Input({required: true}) public code: string = '';
    @Input({required: true}) public language: 'html' | 'javascript' = 'html';
    @Input() public placeholder: string = '';

    @Output() codeChange: EventEmitter<string> = new EventEmitter<string>();

    protected readonly Sftoomi = Sftoomi;

    protected readonly languages: LanguageDescription[] = [
        LanguageDescription.of({ name: 'html', support: html() })
    ];
}
