import { Component } from '@angular/core';

import AppBaseModule from '../../components/core/app-base-module'

@Component({
    selector: 'app-report-templates',
    imports: [],
    templateUrl: './module.component.html',
    styleUrl: './module.component.scss'
})

export default class ReportTemplatesModuleComponent extends AppBaseModule
{
    protected override permission: string | null = 'REPORT_TEMPLATES_MODULE';
}
