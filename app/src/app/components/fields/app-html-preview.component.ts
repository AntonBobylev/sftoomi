import { Component, input, InputSignal, ViewEncapsulation } from '@angular/core';

import { SafePipe } from '../../pipes/safe.pipe';

@Component({
    selector: 'app-html-preview',
    template: `<div [innerHTML]="code() ?? '' | safe"></div>`,
    imports: [
        SafePipe
    ],
    encapsulation: ViewEncapsulation.ShadowDom
})

export class AppHtmlPreviewComponent
{
    public code: InputSignal<string | undefined> = input<string>();
}
