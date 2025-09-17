import { Component } from '@angular/core';

import TemplatesModuleTableComponent from './table/table.component';

@Component({
    selector: 'templates-module',
    templateUrl: './templates.component.html',
    imports: [
        TemplatesModuleTableComponent
    ],
    styleUrl: './templates.component.less'
})

export default class TemplatesModuleComponent
{
}
