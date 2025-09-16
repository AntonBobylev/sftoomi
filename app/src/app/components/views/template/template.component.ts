import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import Sftoomi from '../../../class/Sftoomi';

import { SafePipe } from '../../../pipes/safe.pipe';

import AppCodeEditorComponent from '../../fields/app-code-editor/app-code-editor.component';

@Component({
    selector: 'template-module',
    templateUrl: './template.component.html',
    imports: [
        SafePipe,
        FormsModule,
        AppCodeEditorComponent
    ],
    styleUrl: './template.component.less'
})

export default class TemplateComponent
{
    protected templateCode: string = this.getDefaultValue();
    protected readonly Sftoomi = Sftoomi;

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
