import { Component, input, InputSignal, ViewEncapsulation } from '@angular/core';

import { SafePipe } from '../../pipes/safe.pipe';

@Component({
    selector: 'app-html-preview',
    template: `<div style="width: 100%; height: 100%" [innerHTML]="code() ?? '' | safe"></div>`,
    imports: [
        SafePipe
    ],
    encapsulation: ViewEncapsulation.ShadowDom
})

export class AppHtmlPreviewComponent
{
    public code: InputSignal<string | undefined> = input<string>();
}
