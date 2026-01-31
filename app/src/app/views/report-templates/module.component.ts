import { Component } from '@angular/core';

import AppBaseModule from '../../components/core/app-base-module'

import ReportTemplatesTableComponent from "./table/table.component";

@Component({
    selector: 'app-report-templates',
    imports: [
        ReportTemplatesTableComponent
    ],
    templateUrl: './module.component.html',
    styleUrl: './module.component.scss'
})

export default class ReportTemplatesModuleComponent extends AppBaseModule
{
    protected override permission: string | null = 'REPORT_TEMPLATES_MODULE';
}
