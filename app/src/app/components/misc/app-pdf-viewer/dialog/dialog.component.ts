import { Component, inject } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { NZ_MODAL_DATA, NzModalFooterDirective } from 'ng-zorro-antd/modal'
import { NzButtonComponent } from 'ng-zorro-antd/button'

import AppBaseDialog from '../../../core/app-base-dialog'

import AppPdfViewerComponent from '../app-pdf-viewer.component'

export type AppPdfViewerDialogIn = {
    src: string
}

@Component({
    selector: 'app-pdf-viewer-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        AppPdfViewerComponent,
        NzButtonComponent,
        NzModalFooterDirective
    ],
    styleUrls: [
        './dialog.component.less',
        '../../../core/app-base-edit-dialog/app-base-edit-dialog.less'
    ]
})

export default class AppPdfViewerDialogComponent extends AppBaseDialog
{
    protected override readonly data: AppPdfViewerDialogIn = inject(NZ_MODAL_DATA);

    protected override form: FormGroup = new FormGroup({});

    protected override readonly width: number | string | undefined = '100%';
}
