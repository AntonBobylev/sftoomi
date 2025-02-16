import { Component } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';

import Sftoomi from '../../../class/Sftoomi';

@Component({
    selector: 'app-language-switcher',
    imports: [TuiButton],
    templateUrl: './app-language-switcher.component.html',
    styleUrl: './app-language-switcher.component.scss'
})

export default class AppLanguageSwitcherComponent
{
    public switchLanguage(event: any): void
    {
        event.stopPropagation();
        Sftoomi.Translator.switchToTheNextLocale();
    }
}
