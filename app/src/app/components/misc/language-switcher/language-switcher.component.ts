import { Component } from '@angular/core';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';

import Sftoomi from '../../../class/Sftoomi';

@Component({
    selector: 'language-switcher',
    templateUrl: './language-switcher.component.html',
    imports: [
        NzTooltipDirective,
        NzButtonComponent,
        NzIconDirective
    ],
    styleUrl: './language-switcher.component.less'
})

export default class LanguageSwitcherComponent
{
    protected readonly Sftoomi = Sftoomi;

    protected onClick(event: Event): void
    {
        event.stopPropagation();
        Sftoomi.Translator.switchToTheNextLocale();
    }
}
