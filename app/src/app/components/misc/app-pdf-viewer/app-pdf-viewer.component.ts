import { Component, input, InputSignal } from '@angular/core'
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer'
import { DateTime } from 'luxon';

@Component({
    selector: 'app-pdf-viewer',
    templateUrl: './app-pdf-viewer.component.html',
    imports: [
        NgxExtendedPdfViewerModule
    ],
    styleUrl: './app-pdf-viewer.component.less'
})

export default class AppPdfViewerComponent
{
    public readonly src: InputSignal<string> = input.required();

    public readonly showOpenFileButton: InputSignal<false> = input(false);
    public readonly showTextButton: InputSignal<false> = input(false);
    public readonly showDrawButton: InputSignal<false> = input(false);
    public readonly showHighlightButton: InputSignal<false> = input(false);
    public readonly showAddImageButton: InputSignal<false> = input(false);

    public readonly height: InputSignal<string> = input('600px');

    public readonly filename: InputSignal<string> = input(DateTime.now().toSeconds().toString() + '.pdf');
}
